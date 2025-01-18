"use server";

import { createServerActionProcedure } from "zsa";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { Logger } from "tslog";
import { kv } from "@vercel/kv";

import { cookies, headers } from "next/headers";
import { reviewFormSchema } from "@/app/[locale]/dashboard/create-review/types";
import { PrismaReviewGetPayload } from "@/app/components/ReviewCard";

const logger = new Logger({ name: "review" });

const AdminRequestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const session = await auth();
    const { role } = session?.user as any;

    if (!(role as $Enums.role[]).includes($Enums.role.ADMIN)) {
      throw new Error("UNAUTHORIZED");
    }

    const reqHeaders = headers();
    return {
      ...session,
      cookies: JSON.stringify(cookies().getAll()),
      ip: reqHeaders.get("x-forwarded-for") as string,
      userAgent: reqHeaders.get("user-agent"),
      xAppVersion: reqHeaders.get("sec-ch-ua"),
    };
  })
  .createServerAction()
  .onComplete((res) => {
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

const UserRequestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const reqHeaders = headers();

    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("UNAUTHORIZED");
    }

    const IP_Address = reqHeaders.get("x-forwarded-for");
    const key = `REQUEST_REVIEW_${
      process.env.PROJECT_NAME ?? ""
    }_${IP_Address}`;

    if (process.env.NODE_ENV == "production") {
      const kv_ip = ((await kv.get(key)) ?? 0) as number;

      await kv.set(key, `${(kv_ip ?? 0) + 1}`, {
        ex: +(process.env.REQUEST_TTS_TIME ?? 10),
      });

      if (
        kv_ip &&
        kv_ip >= ((process.env.REQUEST_RATE_COUNT ?? 10) as number)
      ) {
        throw new Error("RATE_LIMIT");
      }
    }

    return {
      ...session,
      cookies: JSON.stringify(cookies().getAll()),
      ip: reqHeaders.get("x-forwarded-for") as string,
      userAgent: reqHeaders.get("user-agent"),
      xAppVersion: reqHeaders.get("sec-ch-ua"),
    };
  })
  .createServerAction()
  .onComplete((res) => {
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

const requestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const reqHeaders = headers();

    const session = await auth();

    const IP_Address = reqHeaders.get("x-forwarded-for");
    const key = `REQUEST_REVIEW_${
      process.env.PROJECT_NAME ?? ""
    }_${IP_Address}`;

    if (process.env.NODE_ENV == "production") {
      const kv_ip = ((await kv.get(key)) ?? 0) as number;

      await kv.set(key, `${(kv_ip ?? 0) + 1}`, {
        ex: +(process.env.REQUEST_TTS_TIME ?? 10),
      });

      if (
        kv_ip &&
        kv_ip >= ((process.env.REQUEST_RATE_COUNT ?? 10) as number)
      ) {
        throw new Error("RATE_LIMIT");
      }
    }

    return {
      ...session,
      cookies: JSON.stringify(cookies().getAll()),
      ip: reqHeaders.get("x-forwarded-for") as string,
      userAgent: reqHeaders.get("user-agent"),
      xAppVersion: reqHeaders.get("sec-ch-ua"),
    };
  })
  .createServerAction()
  .onComplete((res) => {
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

export const createReview = UserRequestProvider.input(reviewFormSchema)
  .output(
    z.promise(
      z.object({ success: z.boolean(), message: z.string().optional() })
    )
  )
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.review.create({
        data: {
          title: input.title,
          body: input.body,
          serviceQuality: input.serviceQuality,
          responseTime: input.responseTime,
          professionalism: input.professionalism,
          valueForMoney: input.valueForMoney,
          flexibility: input.flexibility,

          userId: ctx?.user?.id as string,
          rank:
            Math.round(
              (+input.serviceQuality +
                input.responseTime +
                input.professionalism +
                input.valueForMoney +
                input.flexibility) /
                0.05
            ) / 100,
          isGhast: false,
          profilePicture: ctx?.user?.image as string,
          author: ctx?.user?.name as string,
          ip: ctx.ip,
          cookies: ctx.cookies,
          userAgent: ctx.userAgent,
          xAppVersion: ctx.xAppVersion,
        },
      });

      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        message: "Something went wrong, please try again",
      };
    }
  });

export const ToggleAcceptationReview = AdminRequestProvider.input(
  z.object({
    id: z.number(),
    accepted: z.boolean(),
  })
)
  .output(
    z.promise(
      z.object({ success: z.boolean(), message: z.string().optional() })
    )
  )
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.review.update({
        where: {
          id: input.id,
        },
        data: {
          isAccepted: input.accepted,
          validatedByAdmin: true,
        },
      });
      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        message: "SERVER_ERROR",
      };
    }
  });

export const deleteReview = AdminRequestProvider.input(
  z.object({
    id: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.review.delete({
        where: {
          id: input.id,
        },
      });
      return true;
    } catch (e) {
      return false;
    }
  });

export const getReview = requestProvider
  .input(
    z.object({
      id: z.number(),
    })
  )
  .output(z.promise(z.custom<PrismaReviewGetPayload>()))
  .handler(async ({ input, ctx }) => {
    return await prisma.review.findUniqueOrThrow({
      where: {
        id: input.id,
        OR: [
          {
            isAccepted: true,
            validatedByAdmin: true,
          },
          {
            ip: ctx.ip,
          },
        ],
      },
      include: { user: true },
    });
  });
