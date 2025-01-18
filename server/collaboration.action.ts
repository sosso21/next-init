"use server";

import { createServerActionProcedure } from "zsa";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { Logger } from "tslog";

import { cookies, headers } from "next/headers";
import { CollaborationCreateOrUpdateSchema } from "@/app/[locale]/dashboard/collaborations/[page]/types";

const logger = new Logger({ name: "collaboration" });

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
export const deleteCollaboration = AdminRequestProvider.input(
  z.object({
    id: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.collaboration.delete({
        where: {
          id: input.id,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  });

export const createOrUpdateCollaboration = AdminRequestProvider.input(
  CollaborationCreateOrUpdateSchema
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      if (!!input.id) {
        const disconnectPages: { id: number }[] = [];

        await prisma.collaboration
          .findFirstOrThrow({
            where: {
              id: input.id,
            },
            select: {
              page: {
                select: {
                  id: true,
                },
              },
            },
          })
          .then((res) => {
            return res.page
              .filter(
                (p) => !(input.page ?? []).map((p) => p.id)?.includes(p.id)
              )
              .forEach((p) => disconnectPages.push({ id: p.id }));
          });

        await prisma.collaboration.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
            page: {
              disconnect: disconnectPages,
              connect: input.page?.map((p) => ({
                id: p.id,
              })),
            },
          },
        });
      } else {
        await prisma.collaboration.create({
          data: {
            ...input,
            page: {
              connect: input.page?.map((p) => ({
                id: p.id,
              })),
            },
          },
        });
      }
      return true;
    } catch (error) {
      return false;
    }
  });
