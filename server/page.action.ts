"use server";
import { createServerActionProcedure } from "zsa";
import { auth } from "@/auth";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { Logger } from "tslog";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const logger = new Logger({ name: "gallery" });

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
    const logger = new Logger({ name: "request" });
    if (res.isError) logger.error(res.error);
    if (res.status && res.status === "success") {
      logger.info("success");
    }
  });

export const getPagesForAdmin = AdminRequestProvider.output(
  z.promise(
    z.array(
      z.object({
        id: z.number(),
        slug: z.string(),
        backgroundImageId: z.number().nullable(),
      })
    )
  )
).handler(async ({ input, ctx }) => {
  return await prisma.page.findMany({
    select: {
      id: true,
      slug: true,
      backgroundImageId: true,
    },
    orderBy: {
      id: "asc",
    },
  });
});

export const backgroundImageIdPageUpdate = AdminRequestProvider.input(
  z.object({
    pageId: z.number(),
    imageId: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.page.update({
        where: {
          id: input.pageId,
        },
        data: {
          backgroundImageId: input.imageId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  });
