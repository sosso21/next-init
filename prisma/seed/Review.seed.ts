import { PrismaClient } from "@prisma/client";
import { getPicture, reviews_db } from "./data/reviews";
import { Logger } from "tslog";

const prisma = new PrismaClient();

const convertDateToDateTime = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export async function ReviewSeeder() {
  await prisma.review.deleteMany({ where: { id: { not: 0 } } });

  const reviews = await prisma.review.createMany({
    data: reviews_db.map((review) => ({
      // id: review.id ,
      profilePicture:
        review.profilePicture ??
        getPicture({ url: review.profilePicture, author: review.author }),
      author: review.author,
      serviceQuality: review.serviceQuality,
      responseTime: review.responseTime,
      professionalism: review.professionalism,
      valueForMoney: review.valueForMoney,
      flexibility: review.flexibility,
      rank: review.rank,
      title: review.title,
      body: review.body,
      response: review.response,
      //userId: "",
      isGhast: true,
      isAccepted: true,
      validatedByAdmin: true,
      createdAt: convertDateToDateTime(review.date),
    })),
  });

  const logger = new Logger({ name: "review" });
  logger.info(`success :✅ ${reviews.count} reviews was seeded`);
}
