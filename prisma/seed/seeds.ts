import { Logger } from "tslog";
import { PrismaClient } from "@prisma/client";
import { AdSeeder } from "./Ad.seed";
import { ReviewSeeder } from "./Review.seed";
import { GallerySeeder } from "./Gallery.seed";
import { ContestWinningSeeder } from "./ContestWinning.seed";
import { CollaborationSeeder } from "./Collaboration.seed";
import { debug } from "./debug";
import { UserSeeder } from "./User.seed";
import { messageSeeder } from "./Message.seed";
import { PageSeeder } from "./Pages.seed";

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
    case "review":
      await ReviewSeeder();
      break;
    case "gallery":
      await GallerySeeder();
      break;
    case "page":
      await PageSeeder();
      break;
    case "ContestWinning":
      await ContestWinningSeeder();
      break;
    case "Collaboration":
      await CollaborationSeeder();
      break;
    case "debug":
      await debug();
      break;
    case "user":
      await UserSeeder();
      break;
    case "message":
      await messageSeeder();
      break;
    case "all":
      await UserSeeder();
      // await AdSeeder();
      await ReviewSeeder();
      await GallerySeeder();
      await messageSeeder();
      await PageSeeder();
      await ContestWinningSeeder();
      await CollaborationSeeder();
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
