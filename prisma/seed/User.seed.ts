import { $Enums } from "@prisma/client";
import { prisma } from "../..//lib/prisma";
import { Logger } from "tslog";
import { getPicture } from "./data/reviews";
import { createId } from "@paralleldrive/cuid2";
import { stringToSlug } from "../../lib/stingToSlug";
import casual from "casual";

const logger = new Logger({ name: "user" });
export async function UserSeeder() {
  //                   await prisma.user.deleteMany({
  //                   where: { id: { not: "0" } },
  //                   });

  const createUser = (roles: $Enums.role[]) => ({
    username: `${stringToSlug(casual.full_name)}-${createId()}`,
    name: casual.full_name,
    email: `${stringToSlug(casual.full_name)}-${createId()}@${casual.domain}`,
    image: getPicture({
      author: casual.full_name,
    }),
    role: roles,
    phones: [
      {
        number: casual.phone,
        code: "+33",
      },
    ],
  });

  await prisma.user.update({
    where: { email: "sofianetop21.st@gmail.com" },
    data: {
      role: [$Enums.role.ADMIN],
    },
  });

  const users = [
    createUser([$Enums.role.ADMIN, $Enums.role.USER]),
    createUser([$Enums.role.USER]),
    createUser([$Enums.role.ADMIN, $Enums.role.USER]),
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  logger.info(`success :✅ ${users.length} users were seeded`);
}
