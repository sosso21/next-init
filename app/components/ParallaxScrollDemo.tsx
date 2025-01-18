import BlurFade from "@/components/ui/blur-fade";
import Image from "next/image";
import { serviceEnumType } from "../[locale]/[service]/types";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { stringToSlug } from "@/lib/stingToSlug";

export async function ParallaxScrollDemo({
  route = $Enums.servicePage.DEFAULT,
}: {
  route?: serviceEnumType;
}) {
  const parallaxImages = await prisma.gallery
    .findFirst({
      where: {
        slug: stringToSlug(`${route}-parallax`),
      },
      select: {
        slug: true,
        images: {
          select: {
            webp: true,
            tumblr: true,
            host: true,
          },
          orderBy: {
            id: "desc",
          },
        },
      },
    })
    .then((res) => {
      if (!res) return [];

      return res.images.map(({ webp, tumblr, host }, i) => {
        const isLandscape = i % 2 === 0;
        const width = isLandscape ? 800 : 600;
        const height = isLandscape ? 600 : 800;
        return {
          alt: `${res.slug} illustration ${i + 1} `,
          src: `${host}/${webp}`,
          tumblr: `${host}/${tumblr}`,
          width,
          height,
        };
      });
    });

  if (!parallaxImages.length) return null;

  return (
    <section id="photos">
      <div className="gap-1 lg-gap-4 md:gap-2 p-1 md:p-2 lg:p-4 w-full overflow-x-hidden columns-1 md:columns-2 lg:columns-3">
        {parallaxImages.map((img, idx) => (
          <BlurFade key={img.src} delay={0.3 + idx * 0.05}>
            <Image
              src={img.src}
              alt={img.alt}
              blurDataURL={img.tumblr}
              placeholder={!!img.tumblr ? "blur" : "empty"}
              width={img.width}
              height={img.height}
              className="mb-4 rounded-lg object-contain size-full"
              loading="lazy"
            />
          </BlurFade>
        ))}
      </div>
    </section>
  );
}
