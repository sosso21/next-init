import { stringToSlug } from "../../lib/stingToSlug";

import { $Enums, PrismaClient } from "@prisma/client";
import { Logger } from "tslog";
import { getPicture } from "./data/reviews";

const prisma = new PrismaClient();

const logger = new Logger({ name: "gallery" });
export async function GallerySeeder() {
  await prisma.gallery.deleteMany({ where: { id: { not: 0 } } });

  const galleriesData = [
    {
      slug: $Enums.servicePage.DEFAULT,
      profilePicture: "/pictures/img-1.webp",
      tumblrProfilePicture: "/public/pictures/tumblr_img-1.webp",
      category: $Enums.servicePage.DEFAULT,
    },
    {
      slug: $Enums.servicePage.MARRIAGE,
      profilePicture: "/pictures/divers/anna-vi-QUi84upBhoc-unsplash.webp",
      category: $Enums.servicePage.MARRIAGE,
    },
    {
      slug: $Enums.servicePage.PORTRAIT,
      profilePicture:
        "/pictures/divers/stefan-stefancik-7hqY-hoV1vI-unsplash.webp",
      category: $Enums.servicePage.PORTRAIT,
    },
    {
      slug: $Enums.servicePage.EVENT,
      profilePicture: "/pictures/divers/events.webp",
      category: $Enums.servicePage.EVENT,
    },
    {
      slug: $Enums.servicePage.ENTERPRISE,
      profilePicture: "/pictures/divers/seo-galaxy-liOWpCPRS8o-unsplash.webp",
      category: $Enums.servicePage.ENTERPRISE,
    },
    {
      slug: $Enums.servicePage.PREGNANCY,
      profilePicture:
        "/pictures/box-services/janko-ferlic-ZNVGL_Pcf74-unsplash.webp",
      category: $Enums.servicePage.PREGNANCY,
    },
  ];

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

  const data = [
    ...galleriesData.flatMap((gallery) => [
      {
        ...gallery,
        slug: stringToSlug(`${gallery.slug}-parallax`),
        private: false,
        isVital: true,
      },
      {
        ...gallery,
        slug: stringToSlug(`${gallery.slug}-slider`),
        private: false,
        isVital: true,
      },
    ]),
  ];
  const galleries = await prisma.gallery.createMany({
    data: data,
  });

  for (const user of users) {
    const gallery = await prisma.gallery.create({
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

  logger.info(`success :✅ ${galleries.count} galleries were seeded`);
}
