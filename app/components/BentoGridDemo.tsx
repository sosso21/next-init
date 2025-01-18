import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { IconClipboardCopy } from "@tabler/icons-react";
import Image from "next/image";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { prisma } from "@/lib/prisma";
import { ServiceArray } from "../[locale]/[service]/types";
import { $Enums } from "@prisma/client";
import { stringToSlug } from "@/lib/stingToSlug";

export default async function BentoGridDemo({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "bento-grid");

  const items: {
    href: string;
    title: string;
    description: string;
    header: React.JSX.Element;
    icon: React.JSX.Element;
  }[] = await prisma.page
    .findMany({
      where: {
        OR: ServiceArray.filter(
          (service) => service != $Enums.servicePage.DEFAULT
        ).map((service) => ({
          slug: stringToSlug(`${service}`),
        })),
      },
      select: {
        category: true,
        backgroundImage: {
          select: {
            host: true,
            webp: true,
            tumblr: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    })

    .then((response) =>
      response.map((res) => ({
        category: res.category,
        profilePicture: `${res?.backgroundImage?.host ?? ""}/${
          res?.backgroundImage?.webp ?? ""
        }`,
        tumblrProfilePicture: `${res?.backgroundImage?.host ?? ""}/${
          res?.backgroundImage?.tumblr ?? ""
        }`,
      }))
    )

    .then((response) =>
      response.map((page) => {
        const category = page.category?.toLowerCase();
        return {
          href: `/${locale}/${category}`,
          title: t(`${category}`),
          description: t(`${category}-description`),

          header: (
            <Skeleton
              src={page.profilePicture ?? ""}
              alt={t(`${category}-alt`)}
              blurDataURL={page.tumblrProfilePicture ?? ""}
            />
          ),
          icon: <IconClipboardCopy className="w-4 h-4" />,
        };
      })
    );

  return (
    <section className="my-5 px-1 w-full">
      <h2 className="mx-auto my-8 text-2xl text-center"> {t("title")} </h2>

      <BentoGrid className="mx-auto mb-4 w-full md:w-5/6 lg:w-2/3 max-w-8xl">
        {items.map((item, i) => (
          <BentoGridItem
            href={item.href}
            key={i}
            className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            title={item.title}
            description={item.description}
            header={item.header}
          />
        ))}
      </BentoGrid>
    </section>
  );
}
const Skeleton = ({
  src,
  alt,
  blurDataURL,
}: {
  src: string;
  alt: string;
  blurDataURL: string;
}) => (
  <div className="flex flex-1 rounded-xl bg-ring w-full h-full min-h-[10rem]">
    <div className="relative w-full h-full">
      <Image
        fill
        alt={alt}
        src={src}
        loading="lazy"
        blurDataURL={blurDataURL}
        placeholder={!!blurDataURL ? "blur" : "empty"}
        className="object-cover"
      />
    </div>
  </div>
);
