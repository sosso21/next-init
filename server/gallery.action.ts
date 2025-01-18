"use server";
import { createServerActionProcedure } from "zsa";
import { galleryFromSchema } from "@/app/[locale]/dashboard/upload-images/types";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { stringToSlug } from "@/lib/stingToSlug";
import { $Enums, Prisma } from "@prisma/client";
import { z } from "zod";
import { Logger } from "tslog";
import { getPicture } from "@/prisma/seed/data/reviews";
import {
  createOrUpdateGallerySchema,
  createOrUpdateGalleryType,
} from "@/app/[locale]/dashboard/create-gallery/types";
import { cookies, headers } from "next/headers";
import { GallerySchema } from "@/app/[locale]/galleries/[page]/types";

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

export const createForNewUsers = async () => {
  const users = await prisma.user.findMany({
    where: {
      galleries: {
        none: {},
      },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      galleries: true,
    },
  });
  for (let index = 0; index < users.length; index++) {
    const user = users[index];
    await prisma.gallery.create({
      data: {
        slug: `${stringToSlug(user.username ?? (user.name as string))}`,
        profilePicture: getPicture({
          author: user.name ?? (user.username as string),
          url: user?.image,
        }),

        users: {
          connect: [
            {
              id: user.id,
            },
          ],
        },
      },
    });
  }
};

export const getGalleries = AdminRequestProvider.input(
  z.custom<Prisma.GalleryFindManyArgs>()
)
  .output(
    z.promise(
      z.custom<
        {
          id: number;
          slug: string;
          profilePicture: string | null;
          category: $Enums.servicePage | null;
          private: boolean;
          createdAt: Date;
          updatedAt: Date | null;
          deletedAt: Date | null;
        }[]
      >()
    )
  )
  .handler(async ({ input, ctx }) => {
    const galleries = await prisma.gallery.findMany(input);

    return galleries;
  });

export const uploadImageToGallery = AdminRequestProvider.input(
  galleryFromSchema
)
  .output(z.promise(z.object({ success: z.boolean(), message: z.string() })))
  .handler(async ({ input, ctx }) => {
    try {
      const { galleries, imageUrls } = input;

      for (const imageUrl of imageUrls) {
        const { original, webp, tumblr, host } = imageUrl;
        await prisma.image.create({
          data: {
            original,
            webp,
            tumblr,
            host,
            galleries: {
              connect: galleries.map((galleryId) => ({ id: galleryId })),
            },
          },
        });
      }

      return { success: true, message: "Images added to gallery successfully" };
    } catch (error) {
      logger.error("Error adding images to gallery:", error);
      throw new Error("Error adding images to gallery");
    }
  });

export const searchGalleries = AdminRequestProvider.input(
  z.object({
    q: z.string().nullable().default(null),
    not: z.array(z.number()).nullable().default(null),
    take: z.number().default(10),
  })
)
  .output(z.promise(z.array(GallerySchema).nullable()))
  .handler(async ({ input, ctx }) => {
    const WhereCondition: Prisma.GalleryWhereInput = {
      NOT: {
        id: {
          in: input.not ?? [],
        },
      },
    };

    const query: Prisma.GalleryFindManyArgs = {
      select: {
        id: true,
        slug: true,
        profilePicture: true,
        category: true,
        private: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },

      take: input.take,
    };
    if (!!input.q) {
      WhereCondition.OR = [
        {
          slug: {
            contains: input.q,
          },
        },
      ];

      if (!Number.isNaN(Number(+input.q))) {
        WhereCondition.OR?.push({
          id: Number(input.q),
        });
      }
    }
    query.where = WhereCondition;

    const galleries = await prisma.gallery.findMany(query);
  
    return galleries;
  });

export const makeImageProfile = AdminRequestProvider.input(
  z.object({
    imageId: z.number(),
    galleryId: z.number(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      const image = await prisma.image.findUnique({
        where: {
          id: input.imageId,
        },
        select: {
          webp: true,
          tumblr: true,
          host: true,
        },
      });
      if (!image) return false;

      await prisma.gallery.update({
        where: {
          id: input.galleryId,
        },
        data: {
          profilePicture: `${image.host}/${image.webp}`,
          tumblrProfilePicture: `${image.host}/${image.tumblr}`,
        },
      });

      return true;
    } catch (error) {
      return false;
    }
  });

export const createOrUpdateGallery = AdminRequestProvider.input(
  createOrUpdateGallerySchema
)
  .output(z.promise(createOrUpdateGallerySchema))
  .handler(async ({ input, ctx }) => {
    const data = {
      slug: input.slug,
      profilePicture: input.profilePicture,
      tumblrProfilePicture: input.tumblrProfilePicture ?? null,
      category: input.category as $Enums.servicePage,
      private: input.private,
    };
    const select = {
      id: true,
      slug: true,
      profilePicture: true,
      tumblrProfilePicture: true,
      category: true,
      private: true,
    };
    if (input.id) {
      return (await prisma.gallery.update({
        where: {
          id: input.id,
        },
        data: data,
        select: select,
      })) as createOrUpdateGalleryType;
    } else {
      return (await prisma.gallery.create({
        data: data,
        select: select,
      })) as createOrUpdateGalleryType;
    }
  });

export const getGalleryUsersIds = AdminRequestProvider.input(
  z.object({ id: z.number() })
)
  .output(z.promise(z.array(z.string()).nullable()))

  .handler(async ({ input, ctx }) => {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: input.id,
      },
      select: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });
    return gallery?.users?.map((user) => user.id) ?? [];
  });

export const addUserToGallery = AdminRequestProvider.input(
  z.object({
    galleryId: z.number(),
    userId: z.string(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.gallery.update({
        where: {
          id: input.galleryId,
        },
        data: {
          users: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  });

export const removeUserFromGallery = AdminRequestProvider.input(
  z.object({
    galleryId: z.number(),
    userId: z.string(),
  })
)
  .output(z.promise(z.boolean()))
  .handler(async ({ input, ctx }) => {
    try {
      await prisma.gallery.update({
        where: {
          id: input.galleryId,
        },
        data: {
          users: {
            disconnect: {
              id: input.userId,
            },
          },
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  });

export const getGalleryForAdmin = AdminRequestProvider.input(
  z.object({
    galleryId: z.number(),
  })
)
  .output(z.promise(createOrUpdateGallerySchema.nullable()))
  .handler(async ({ input, ctx }) => {
    const gallery = await prisma.gallery.findUnique({
      where: {
        id: input.galleryId,
      },
      select: {
        id: true,
        slug: true,
        profilePicture: true,
        tumblrProfilePicture: true,
        category: true,
        private: true,
      },
    });

    if (!gallery) return null;

    return gallery as createOrUpdateGalleryType;
  });
