import { useServerTranslation } from "@/lib/use-translation/use-server-translation";

import { CardType, FocusCards } from "@/components/ui/focus-cards";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { $Enums, Prisma } from "@prisma/client";
import { Footer } from "@/app/components/footer";
import {
  LocalePaginationParamsType,
  localePaginationSchema,
} from "../../reviews/[page]/types";
import { SmartPagination } from "@/app/components/paginationDemo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function Home({ params }: LocalePaginationParamsType) {
  const t = useServerTranslation(params.locale, "galleries");
  const take = 12;
  const safeParams = localePaginationSchema.parse(params);

  const session = await auth();
  const userSession = session?.user as any;

  const conditions: Prisma.GalleryWhereInput[] = [
    {
      private: false,
    },
  ];
  if (
    userSession?.role &&
    (userSession?.role as $Enums.role[]).includes($Enums.role.ADMIN)
  ) {
    conditions.push({
      private: true,
    });
  }
  if (userSession?.id) {
    conditions.push({
      users: {
        some: {
          id: userSession?.id,
        },
      },
    });
  }

  const galleries = await prisma.gallery
    .findMany({
      where: {
        OR: conditions,
      },
      select: {
        id: true,
        slug: true,
        profilePicture: true,
        tumblrProfilePicture: true,
        private: true,
        category: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },

        images: {
          select: {
            id: true,
            webp: true,
            tumblr: true,
            host: true,
          },
        },
      },
      take: take,
      skip: (safeParams.page - 1) * take,
      orderBy: {
        // userId: "asc",
        id: "desc",
      },
    })
    .then((res): CardType[] =>
      res.map(
        (gallery): CardType => ({
          id: gallery.id,
          title: gallery.slug,
          src: gallery?.profilePicture ?? "",

          href: `/${params.locale}/gallery/${gallery.slug}/1`,
          blurDataURL: gallery?.tumblrProfilePicture ?? "",
          private: gallery.private,
          category: gallery.category,
          imagesCount: gallery.images.length,
          images: gallery.images,
          users: gallery.users,
        })
      )
    );

  const count = await prisma.gallery.count({
    where: {
      OR: conditions,
    },
  });
  return (
    <main className="flex flex-col justify-between w-full min-h-screen">
      <section className="flex justify-around items-center my-8 px-2 w-full">
        <h1 className="text-2xl">{t("title")} </h1>

        {((userSession as any)?.role ?? []).includes($Enums.role.ADMIN) ? (
          <Link
            href={`/${params.locale}/dashboard/create-gallery`}
            aria-label="create gallery"
          >
            <Button className="flex items-center gap-2">
              <Plus size="sm" />
              <span>{t("create-gallery")}</span>
            </Button>
          </Link>
        ) : null}
      </section>

      <FocusCards cards={galleries as CardType[]} />

      <SmartPagination
        hasPreviousPage={safeParams.page > 1}
        hasNextPage={safeParams.page * take < count}
        count={count}
        currentPage={safeParams.page}
        link={`/${safeParams.locale}/galleries`}
        take={take}
        className="mt-4"
      />

      <Footer locale={params.locale} />
    </main>
  );
}
