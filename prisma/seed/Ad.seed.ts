import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function AdSeeder() {
  await prisma.ad.deleteMany({ where: { id: { not: 0 } } });

  const ads = await prisma.ad.createMany({
    data: [],
  });

  console.log({ ads });
}
