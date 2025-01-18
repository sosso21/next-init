import { Logger } from "tslog";
import { PrismaClient } from "@prisma/client";
import { AdSeeder } from "./Ad.seed";

import { debug } from "./debug";
import { UserSeeder } from "./User.seed";

const prisma = new PrismaClient();

async function main() {
  const [seed, language]: string[] = (process.argv[2] ?? "").split("-");
  const logger = new Logger({
    name: "seed",
  });

  switch (seed) {
    case "ad":
      await AdSeeder();
      break;
    case "debug":
      await debug();
      break;
    case "user":
      await UserSeeder();
      break;
    case "all":
      await UserSeeder();
      break;

    default:
      return logger.error(
        "invalid seed \b use: ad | review | gallery | ContestWinning | Collaboration | all"
      );
  }
  logger.info(`success :✅ ${process.argv[2]} was seeded`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
  });
