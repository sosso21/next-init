import {
  LocalePaginationParamsType,
  localePaginationSchema,
} from "@/app/[locale]/reviews/[page]/types";
import ExpandableContestWinningsCardDemo from "@/app/components/expandable-contest-winning-card-demo";
import { Footer } from "@/app/components/footer";
import { SmartPagination } from "@/app/components/paginationDemo";
import { prisma } from "@/lib/prisma";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { ContestWinning } from "@prisma/client";

export default async function Home({ params }: LocalePaginationParamsType) {
  const t = useServerTranslation(params.locale, "contest-winning-dashboard");
  const safeParams = localePaginationSchema.parse(params);
  const take = 10;
  const count = await prisma.pageContestWinning.count();

  const collaborations: ContestWinning[] = await prisma.contestWinning.findMany(
    {
      take: take,
      skip: (safeParams.page - 1) * take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        page: true,
      },
    }
  );

  const pages = await prisma.page.findMany({
    select: {
      id: true,
      slug: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  return (
    <main className="flex flex-col justify-center items-center gap-6 pt-8 w-full min-h-screen">
      <h1 className="text-2xl"> {t("title")} </h1>

      <ExpandableContestWinningsCardDemo
        cards={collaborations}
        locale={params.locale}
        pages={pages}
      />
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
