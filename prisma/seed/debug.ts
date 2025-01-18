import { PrismaClient } from "@prisma/client";
import { Logger } from "tslog";

const prisma = new PrismaClient();

export async function debug() {
  const logger = new Logger({ name: "debug" });

  const galleries = await prisma.gallery.findMany({
    include: {
      users: true,
      images: true,
    },
  });
  // logger.info("galleries: ", galleries);

  const users = await prisma.user.findFirst({
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
      galleries: {
        select: {
          id: true,
          private: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
  logger.info("users: ", users);
}
// debug();
