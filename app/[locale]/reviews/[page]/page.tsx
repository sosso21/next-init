import { Footer } from "@/app/components/footer";
import { ReviewCard } from "@/app/components/ReviewCard";
import { Ranking } from "@/app/components/ranking";
import { BoxRevealDemo } from "@/app/components/reviews-interface";
import { DialogReviewItem } from "@/app/components/DialogReviewItem";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { LocalePaginationParamsType, localePaginationSchema } from "./types";
import { headers } from "next/headers";

export default async function Home({ params }: LocalePaginationParamsType) {
  const safeParams = localePaginationSchema.parse(params);

  const reqHeaders = headers();
  const ip = reqHeaders.get("x-forwarded-for") as string;

  const averageReview = await prisma.review.aggregate({
    _avg: {
      serviceQuality: true,
      responseTime: true,
      professionalism: true,
      valueForMoney: true,
      flexibility: true,
      rank: true,
    },
    where: {
      OR: [
        {
          isAccepted: true,
          validatedByAdmin: true,
        },
        {
          ip: ip,
        },
      ],
    },
  });

  return (
    <main className="flex flex-col justify-between items-center w-full min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <DialogReviewItem />
      </Suspense>

      <BoxRevealDemo locale={params.locale} />

      <Ranking
        locale={params.locale}
        serviceQuality={
          Math.round((averageReview._avg.serviceQuality as number) * 100) / 100
        }
        responseTime={
          Math.round((averageReview._avg.responseTime as number) * 100) / 100
        }
        professionalism={
          Math.round((averageReview._avg.professionalism as number) * 100) / 100
        }
        valueForMoney={
          Math.round((averageReview._avg.valueForMoney as number) * 100) / 100
        }
        flexibility={
          Math.round((averageReview._avg.flexibility as number) * 100) / 100
        }
        rank={Math.round((averageReview._avg.rank as number) * 100) / 100}
        isGhost
      />
      <ReviewCard locale={params.locale} page={safeParams.page} />

      <Footer locale={params.locale} />
    </main>
  );
}
