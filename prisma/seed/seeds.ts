import { PrismaClient } from "@prisma/client";
import { AdSeeder } from "./Ad.seed";

const prisma = new PrismaClient();

async function main() {
  const [seed, language]: string[] = (process.argv[2] ?? "").split("-");

  switch (seed) {
    case "ad":
      await AdSeeder();
      break;
    default:
      return console.log("invalid seed \b use: ad");
  }
  console.info(`success :✅ ${process.argv[2]} was seeded`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
  });
