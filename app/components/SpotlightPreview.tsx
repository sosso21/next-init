import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import Image from "next/image"; // Importation du composant Image de Next.js
import { CustomMDX } from "./mdx-components";
import { cn } from "@/lib/utils";

import { whisper_regular } from "../font/fonts";
import { serviceEnumType } from "../[locale]/[service]/types";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { stringToSlug } from "@/lib/stingToSlug";

export async function SpotlightPreview({
  locale,
  route = $Enums.servicePage.DEFAULT,
}: {
  locale: Lang;
  route?: serviceEnumType;
}) {
  const t = useServerTranslation(locale, "SpotlightPreview");

  const page = await prisma.page
    .findFirst({
      where: {
        slug: stringToSlug(`${route}`),
      },
      select: {
        backgroundImage: {
          select: {
            host: true,
            webp: true,
            tumblr: true,
          },
        },
        backgroundColor: true,
        backgroundOpacity: true,
      },
    })
    .then((res) => ({
      ...res,
      profilePicture: `${res?.backgroundImage?.host ?? ""}/${
        res?.backgroundImage?.webp ?? ""
      }`,
      tumblrProfilePicture: `${res?.backgroundImage?.host ?? ""}/${
        res?.backgroundImage?.tumblr ?? ""
      }`,
    }));

  return (
    <section
      className={`flex relative md:justify-center md:items-center bg-grid-white/[0.02] bg-cover bg-no-repeat bg-center rounded-md w-full h-[30rem] md:h-screen antialiased overflow-hidden`}
    >
      <Image
        src={page?.profilePicture ?? ""}
        blurDataURL={page?.tumblrProfilePicture ?? ""}
        placeholder={!!page?.tumblrProfilePicture ? "blur" : "empty"}
        alt={`DKPhotographe ${t(`${route}-title`)}  spotlight`}
        fill
        priority
        quality={75}
        className="z-0 absolute inset-0 object-cover"
      />
      <div
        className={cn(
          `m-auto z-20 py-5 rounded-lg w-full max-w-4xl flex justify-center items-center`,
          page?.backgroundColor,
          page?.backgroundOpacity,
          whisper_regular.className
        )}
      >
        <h1 className="flex justify-center items-center my-auto py-5 font-bold text-4xl text-center text-white md:text-7xl">
          <CustomMDX source={t(`${route}-title`)} />
        </h1>
      </div>
    </section>
  );
}
