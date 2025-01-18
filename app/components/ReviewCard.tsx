"use server";
import { CanvasRevealEffect, Card } from "@/components/ui/canvas-reveal-effect";
import { Lang } from "@/lib/use-translation/types";
import { Star } from "lucide-react";

import { Ranking } from "./ranking";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { SmartPagination } from "./paginationDemo";
import { headers } from "next/headers";
import { formatDate } from "@/lib/hermes-moment";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export type PrismaReviewGetPayload = Prisma.ReviewGetPayload<{
  include: { user: true };
}>;
export async function ReviewCard({
  locale,
  page = 1,
}: {
  locale: Lang;
  page: number;
}) {
  const take = 10;
  const resultArray = [];
  const reqHeaders = headers();
  const ip = reqHeaders.get("x-forwarded-for") as string;

  const reviews_db = await prisma.review.findMany({
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

    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: take,
    skip: (page - 1) * take,
  });
  const count = await prisma.review.count();

  for (let i = 0; i < reviews_db.length; i += 2) {
    resultArray.push(reviews_db.slice(i, i + 2));
  }

  return (
    <section className="py-9 w-full">
      {resultArray.map((reviews, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-12 justify-center gap-4 p-4 mx-auto`}
        >
          {reviews.map((review, idx2) => (
            <ReviewCardItem
              key={`${idx}-${idx2}`}
              review={review}
              className={`${
                idx2 % 2 === 0 ? "lg:col-span-5" : "lg:col-span-7"
              } ${idx % 2 === 0 && idx2 % 2 === 0 ? "order-last" : ""}`}
              locale={locale}
            />
          ))}
        </div>
      ))}

      <SmartPagination
        hasPreviousPage={page > 1}
        hasNextPage={page * take < count}
        count={count}
        currentPage={page}
        link={`/${locale}/reviews`}
        take={take}
        className="mt-4"
      />
    </section>
  );
}

export const ReviewCardItem = ({
  review,
  className,
  locale,
}: {
  review: PrismaReviewGetPayload;
  className?: string;
  locale: Lang;
}) => {
  const createdAt = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(review.createdAt as Date);

  return (
    <Card
      key={review.id}
      id={review.id}
      className={cn(`col-span-full py-4`, className)}
      title={
        <Ranking
          onCard
          locale={locale}
          rank={review.rank}
          serviceQuality={review.serviceQuality}
          responseTime={review.responseTime}
          professionalism={review.professionalism}
          valueForMoney={review.valueForMoney}
          flexibility={review.flexibility}
          isGhost={review.isGhast}
        />
      }
      icon={
        <div className="place-items-start gap-2 grid grid-cols-12 mx-4 text-10 text-start lg:text-lg">
          <Avatar className="col-span-2 row-span-2 mx-auto my-auto min-w-12 min-h-12">
            <AvatarImage
              className="rounded-full w-12 h-12 object-cover"
              alt={
                (review.isGhast ? review.author : review.user?.name) as string
              }
              src={
                (review.isGhast
                  ? review.profilePicture
                  : review.user?.image) as string
              }
            />
            <AvatarFallback>
              {(review.isGhast ? review.author : review.user?.name) as string}
            </AvatarFallback>
          </Avatar>

          <div className="col-span-9">
            <span>
              {" "}
              {
                (review.isGhast ? review.author : review.user?.name) as string
              }{" "}
            </span>
            <i className="mx-2">-</i>
            <time dateTime={createdAt}> {formatDate(createdAt, locale)}</time>
          </div>

          <div className="flex items-start col-span-9 my-0.5">
            <Badge className="flex justify-start items-center mx-4 px-2 rounded-md">
              {review.rank}
              <Star size={"1rem"} className="mx-1 fill-primary-foreground" />
            </Badge>
            <p>{review?.title ?? ""} </p>
          </div>
          <p className="col-span-11 lg:col-span-10 my-1.5 whitespace-pre-line">
            {review.body}
          </p>
        </div>
      }
    >
      <CanvasRevealEffect animationSpeed={5.1} />
    </Card>
  );
};
