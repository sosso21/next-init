import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { headers } from "next/headers";
import { formatDate } from "@/lib/hermes-moment";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ReviewCard = ({
  id,
  profilePicture,
  name,
  createdAt,
  body,
  locale,
}: {
  id: number;
  profilePicture: string;
  name: string;
  createdAt: string;
  body: string;
  locale: Lang;
}) => {
  return (
    <Link
      href={`/${locale}/reviews/1?show_review=${id}`}
      aria-label={`${name} review`}
      className={cn(
        "w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-neutral-950/[.1] bg-neutral-950/[.01] hover:bg-neutral-950/[.05]",
        // dark styles
        "dark:border-neutral-50/[.1] dark:bg-neutral-50/[.10] dark:hover:bg-neutral-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Avatar className="my-auto">
          <AvatarImage
            className="rounded-full w-8 h-8 object-cover"
            alt={name}
            src={profilePicture}
          />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <figcaption className="font-medium text-sm dark:text-white">
            {name}
          </figcaption>
          <p className="font-medium text-xs dark:text-white/40">{createdAt}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </Link>
  );
};

export async function MarqueeDemo({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "marquee");

  const reqHeaders = headers();
  const ip = reqHeaders.get("x-forwarded-for") as string;

  const db_reviews = await prisma.review.findMany({
    where: {
      title: { not: null },
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
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
  const reviews = db_reviews.map(
    (
      review
    ): {
      id: number;
      profilePicture: string;
      name: string;
      createdAt: string;
      body: string;
      title?: string;
    } => {
      const result = {
        id: review.id,
        createdAt: formatDate(review.createdAt, locale),
        body: review.title as string,
      };
      if (review.isGhast) {
        return {
          ...result,
          name: review.author as string,
          profilePicture: review.profilePicture as string,
        };
      } else {
        return {
          ...result,
          name: review?.user?.name as string,
          profilePicture: review?.user?.image as string,
        };
      }
    }
  );

  const firstRow = reviews.slice(0, reviews.length / 2);
  const secondRow = reviews.slice(reviews.length / 2);

  return (
    <section className="mx-auto max-w-xs md:max-w-md lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl h-auto overflow-hidden">
      <div className="relative flex flex-col justify-center items-center border rounded-lg w-full h-[500px] overflow-hidden">
        <Marquee pauseOnHover className="[--duration:180s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.id} {...review} locale={locale} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:180s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.id} locale={locale} {...review} />
          ))}
        </Marquee>

        <Link
          aria-label={t("reviews")}
          href={`/${locale}/dashboard/create-review`}
        >
          <Button size={"lg"} className="my-4 md:my-10">
            {" "}
            {t("reviews")}
          </Button>
        </Link>

        <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-white dark:from-background w-1/3 pointer-events-none"></div>
        <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-white dark:from-background w-1/3 pointer-events-none"></div>
      </div>
    </section>
  );
}
