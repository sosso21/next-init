import { ServiceArray } from "../..//app/[locale]/[service]/types";
import { stringToSlug } from "../../lib/stingToSlug";
import { PrismaClient } from "@prisma/client";
import { Logger } from "tslog";

const logger = new Logger({ name: "pages" });

const prisma = new PrismaClient();

export async function PageSeeder() {
  await prisma.page.deleteMany({ where: { id: { not: 0 } } });

  const data = ServiceArray.map((page, index) => ({
    id: index + 1,
    slug: `${stringToSlug(page as string)}`,
    category: page,
  }));

  const pages = await prisma.page.createMany({
    data: data,
  });

  logger.info(`success :✅ ${pages.count} pages were seeded`);
}
