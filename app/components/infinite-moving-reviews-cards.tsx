import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { serviceEnumType } from "../[locale]/[service]/types";
import { Lang } from "@/lib/use-translation/types";
import { $Enums } from "@prisma/client";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { stringToSlug } from "@/lib/stingToSlug";
import { prisma } from "@/lib/prisma";

export async function InfiniteMovingCardsDemo({
  locale,
  route = $Enums.servicePage.DEFAULT,
}: {
  locale: Lang;
  route?: serviceEnumType;
}) {
  const t = useServerTranslation(locale, "infinite-moving-cards");

  const ContestWinnings = await prisma.page
    .findFirst({
      where: {
        slug: stringToSlug(`${route}`),
      },
      include: {
        ContestWinning: true,
      },
    })
    .then((res) =>
      res?.ContestWinning.map((item) => ({
        id: item.id,
        link: item.link,
        title: item.title,
        description: item.description,
        picture: item.picture,
        blurPicture: item.blurPicture,
      }))
    );

  if (ContestWinnings?.length) {
    return (
      <section className="relative flex flex-col justify-center items-center mx-auto mt-8 rounded-sm max-w-xs md:max-w-md lg:max-w-screen-md xl:max-w-screen-lg 2xl:max-w-screen-xl h-auto antialiased overflow-hidden">
        <h3 className="mx-auto my-8 text-2xl text-center">
          {t("our-contest-winnings")}
        </h3>
        <InfiniteMovingCards
          items={ContestWinnings ?? []}
          direction="right"
          speed="slow"
        />
      </section>
    );
  } else {
    <></>;
  }
}
