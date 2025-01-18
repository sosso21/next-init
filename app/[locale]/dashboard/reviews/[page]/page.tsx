import {
  LocalePaginationParamsType,
  localePaginationSchema,
} from "@/app/[locale]/reviews/[page]/types";
import { Footer } from "@/app/components/footer";
import { SmartPagination } from "@/app/components/paginationDemo";
import ExpandableCardDemo from "@/app/components/expandable-reviews-card-demo";
import { prisma } from "@/lib/prisma";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Review } from "@prisma/client";
import ExpandableReviewsCardDemo from "@/app/components/expandable-reviews-card-demo";

export default async function Home({ params }: LocalePaginationParamsType) {
  const t = useServerTranslation(params.locale, "review-dashboard");
  const safeParams = localePaginationSchema.parse(params);
  const take = 10;
  const count = await prisma.review.count();

  const reviews: Review[] = await prisma.review.findMany({
    take: take,
    skip: (safeParams.page - 1) * take,
    orderBy: {
      xAppVersion: "asc",
    },
  });

  return (
    <main className="flex flex-col justify-center items-center gap-6 pt-8 w-full min-h-screen">
      <h1 className="text-2xl"> {t("title")} </h1>
      <ExpandableReviewsCardDemo cards={reviews} locale={params.locale} />
      <SmartPagination
        hasPreviousPage={safeParams.page > 1}
        hasNextPage={safeParams.page * take < count}
        count={count}
        currentPage={safeParams.page}
        link={`/${safeParams.locale}/dashboard/reviews`}
        take={take}
        className="mt-4"
      />

      <Footer locale={params.locale} />
    </main>
  );
}
