"use server";

import { createServerActionProcedure } from "zsa";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { z } from "zod";
import { Logger } from "tslog";
import { imageDatabaseSchema } from "@/app/[locale]/gallery/[slug]/types";
import { kv } from "@vercel/kv";

import { cookies, headers } from "next/headers";

const logger = new Logger({ name: "image" });

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

const RequestProvider = createServerActionProcedure()
  .handler(async ({ input, ctx }) => {
    const reqHeaders = headers();

    const session = await auth();
    const IP_Address = reqHeaders.get("x-forwarded-for");
    const key = `REQUEST_IMAGE_${process.env.PROJECT_NAME ?? ""}_${IP_Address}`;

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

export const getImage = RequestProvider.input(
  z.object({ id: z.number(), galleryId: z.number().nullable() })
)
  .output(z.promise(imageDatabaseSchema.nullable()))
  .handler(async ({ input, ctx }) => {
    const image = await prisma.image.findUnique({
      where: { id: input.id },
      select: {
        id: true,
        original: true,
        webp: true,
        tumblr: true,
        host: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        galleries: {
          select: {
            id: true,
            private: true,
            slug: true,
            profilePicture: true,
            users: { select: { id: true } },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!image) return null;

    const galleries = image.galleries ?? [];
    const accessibleGalleries = galleries.filter((gallery) => {
      const isAdmin = !!ctx.user
        ? (((ctx.user as any).role ?? []) as $Enums.role[])?.includes(
            $Enums.role.ADMIN
          )
        : false;
      const isGalleryOwner = gallery.users.some(
        (user) => user.id === ctx.user?.id
      );

      // Gallery access conditions
      return !gallery.private || isAdmin || isGalleryOwner;
    });

    if (input.galleryId) {
      const belongsToSpecifiedGallery = accessibleGalleries.some(
        (gallery) => gallery.id === input.galleryId
      );
      if (!belongsToSpecifiedGallery) return null;
    } else {
      return null;
    }

    return {
      ...image,
      galleries: accessibleGalleries,
    };
  });

export const removeFromGallery = AdminRequestProvider.input(
  z.object({
    imageId: z.number(),
    galleryId: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.image.update({
        where: {
          id: input.imageId,
        },
        data: {
          galleries: {
            disconnect: {
              id: input.galleryId,
            },
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  });

export const addImageToGallery = AdminRequestProvider.input(
  z.object({
    imageId: z.number(),
    galleryId: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.image.update({
        where: {
          id: input.imageId,
        },
        data: {
          galleries: {
            connect: {
              id: input.galleryId,
            },
          },
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  });
