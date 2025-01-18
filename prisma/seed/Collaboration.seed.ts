import { ServiceArray } from "../..//app/[locale]/[service]/types";
import { Prisma, PrismaClient } from "@prisma/client";
import casual from "casual";
import { Logger } from "tslog";
const prisma = new PrismaClient();

export async function CollaborationSeeder() {
  await prisma.collaboration.deleteMany({ where: { id: { not: 0 } } });

  const data: Prisma.CollaborationCreateInput[] = [
    {
      title: casual.full_name,
      description: casual.words(10),
      picture: "/pictures/img-1.webp",
      blurPicture: "/public/pictures/tumblr_img-1.webp",
      link: casual.url,
      page: {
        connect: ServiceArray.map((page, index) => ({
          id: index + 1,
        })),
      },
    },
    {
      title: casual.full_name,
      description: casual.words(10),
      picture: "/pictures/divers/anna-vi-QUi84upBhoc-unsplash.webp",

      blurPicture: "/public/pictures/tumblr_img-1.webp",
      link: casual.url,
      page: {
        connect: ServiceArray.map((page, index) => ({
          id: index + 1,
        })),
      },
    },
    {
      title: casual.full_name,
      description: casual.words(10),
      picture: "/pictures/divers/stefan-stefancik-7hqY-hoV1vI-unsplash.webp",

      blurPicture: "/public/pictures/tumblr_img-1.webp",
      link: casual.url,
      page: {
        connect: ServiceArray.map((page, index) => ({
          id: index + 1,
        })),
      },
    },
    {
      title: casual.full_name,
      description: casual.words(10),
      picture: "/pictures/divers/events.webp",
      blurPicture: "/public/pictures/tumblr_img-1.webp",
      link: casual.url,
      page: {
        connect: ServiceArray.map((page, index) => ({
          id: index + 1,
        })),
      },
    },
    {
      title: casual.full_name,
      description: casual.words(10),
      picture: "/pictures/divers/seo-galaxy-liOWpCPRS8o-unsplash.webp",
      blurPicture: "/public/pictures/tumblr_img-1.webp",
      link: casual.url,
      page: {
        connect: ServiceArray.map((page, index) => ({
          id: index + 1,
        })),
      },
    },
  ];

  const collaborations = [];

  for (let i = 0; i < data.length; i++) {
    const dataElement = data[i];
    collaborations.push(
      await prisma.collaboration.create({
        data: dataElement,
      })
    );
  }
  const logger = new Logger({ name: "collaboration" });
  logger.info(`success :✅ ${collaborations.length} collaborations was seeded`);
}
