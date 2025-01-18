import BoxReveal from "@/components/ui/box-reveal";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { TriggerButton } from "@/components/ui/trigger-button";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const multipleColorText = (text: string) => (
  <p>
    {text.split("%").map((segment, index) =>
      index % 2 === 1 ? (
        <span key={index} className="text-primary">
          {segment}
        </span>
      ) : (
        <span key={index}>{segment}</span>
      )
    )}
  </p>
);

export const BoxRevealDemo = async ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "reviews-interface");
  const review_count = await prisma.review.count();

  const title = t("title");

  const description_title = t("description_title")
    .split("{clientsCount}")
    .join(`${review_count ?? 0}`);

  const description = t("description");

  const db_reviews = await prisma.review.findMany({
    where: {
      profilePicture: {
        not: {
          contains: "api.dicebear.com",
        },
      },
      isAccepted: true,
      validatedByAdmin: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      profilePicture: true,
      rank: true,
      author: true,
    },
    take: 7,
  });
  const Reviews = db_reviews.map((review) => {
    return {
      id: review.id,
      name: review.author,
      designation: (
        <span className="flex items-center">
          {review.rank} <Star size={"1rem"} className="mx-1 fill-foreground" />
        </span>
      ),
      image: review.profilePicture,
    };
  });

  return (
    <section>
      <div className="justify-center items-center mb-10 pt-8 w-full max-w-[32rem] h-full overflow-hidden">
        <BoxReveal boxColor={"var(--primary)"} duration={0.5}>
          <h1 className="font-semibold text-6xl">
            {multipleColorText(title)}{" "}
          </h1>
        </BoxReveal>

        <BoxReveal boxColor={"var(--primary)"} duration={0.5}>
          <h2 className="mt-1 text-lg">
            {multipleColorText(description_title)}
          </h2>
        </BoxReveal>

        <BoxReveal boxColor={"var(--primary)"} duration={0.5}>
          <article className="mt-4">{multipleColorText(description)}</article>
        </BoxReveal>

        <BoxReveal boxColor={"var(--primary)"} duration={0.5}>
          <div className="flex flex-row justify-center items-center mt-20 mb-10 w-full">
            <AnimatedTooltip items={Reviews as any} />
          </div>
        </BoxReveal>
        <div className="flex justify-center my-5 md:my-0.5 -end md:justify">
          <Link
            aria-label={t("make-review")}
            href={`/${locale}/dashboard/create-review`}
          >
            <TriggerButton size={"lg"}>{t("make-review")}</TriggerButton>
          </Link>
        </div>
      </div>
    </section>
  );
};
