"use server";
import { $Enums, Prisma } from "@prisma/client";
const logger = new Logger({ name: "user" });

import { auth } from "@/auth";
import { Logger } from "tslog";
import { createServerActionProcedure } from "zsa";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { userSearchSchema } from "@/app/[locale]/dashboard/create-gallery/types";
import { cookies, headers } from "next/headers";
import { kv } from "@vercel/kv";
import {
  AddPhoneFormSchema,
  usernameUpdateFormSchema,
} from "@/app/[locale]/dashboard/types";

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

export const searchUsers = AdminRequestProvider.input(
  z.object({
    q: z.string(),
    take: z.number().default(5),
    not: z.array(z.string()).default([]),
    include: z.array(z.string()).default([]),
  })
)
  .output(z.promise(z.array(userSearchSchema).nullable()))
  .handler(async ({ input, ctx }) => {
    const query: Prisma.UserFindManyArgs = {
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
      },
      take: input.take,
    };
    if (!!input.q) {
      query.where = {
        OR: [
          {
            id: {
              contains: input.q,
            },
          },
          {
            username: {
              contains: input.q,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: input.q,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: input.q,
              mode: "insensitive",
            },
          },
        ],
      };
    } else {
      query.where = {
        OR: [
          {
            username: {
              not: null,
            },
          },
          {
            username: null,
          },
        ],
      };
    }

    if (input.not.length > 0) {
      query.where = {
        NOT: {
          id: {
            in: input.not,
          },
        },
      };
    }
    if (input.include.length > 0) {
      if (!!query?.where?.OR) {
        query?.where?.OR.push({
          id: {
            in: input.include,
          },
        });
      } else {
        query.where = {
          id: {
            in: input.include,
          },
        };
      }
    }

    return await prisma.user.findMany(query);
  });

export const usernameUpdate = AdminRequestProvider.input(
  usernameUpdateFormSchema
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    const userId = ctx?.user?.id as string;

    try {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          username: input.username,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  });

export const PhoneNumberAdd = UserRequestProvider.input(AddPhoneFormSchema)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    const userId = ctx?.user?.id as string;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          phones: true,
        },
      });
      if (user?.id != null) {
        const phones = (user?.phones ?? []).filter((phone: any) =>
          phone?.number == input.number ? phone?.code !== input.code : true
        );
        phones.push({ code: input.code, number: input.number } as any);

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            phones: phones as any,
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  });

export const PhoneNumberDelete = UserRequestProvider.input(AddPhoneFormSchema)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    const userId = ctx?.user?.id as string;

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          phones: true,
        },
      });
      if (user?.id != null) {
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            phones: [...(user?.phones ?? [])].filter((phone: any) =>
              phone?.number == input.number ? phone?.code !== input.code : true
            ) as any,
          },
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  });
