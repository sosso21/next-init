import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { serviceEnumType } from "../[locale]/[service]/types";
import { prisma } from "@/lib/prisma";
import { $Enums } from "@prisma/client";
import { stringToSlug } from "@/lib/stingToSlug";

type ImageType = {
  src: string;
  alt: string;
};

export async function Slider({
  route = $Enums.servicePage.DEFAULT,
}: {
  route?: serviceEnumType;
}) {
  const images = await prisma.gallery
    .findFirst({
      where: {
        slug: stringToSlug(`${route}-slider`),
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
        return {
          alt: `${res.slug} illustration ${i + 1} `,
          src: `${host}/${webp}`,
          tumblr: `${host}/${tumblr}`,
        };
      });
    });
  return (
    <Carousel
      delay={5000}
      className="p-2 w-screen max-w-2xl h-full md:h-full overflow-hidden"
    >
      <CarouselContent>
        {images.map(({ src, alt, tumblr }, index) => (
          <CarouselItem key={index} className="bg-ring w-96 h-96">
            <div className="p-1 w-full h-full">
              <Image
                width="400"
                height="400"
                className="mx-auto my-auto w-full h-full object-contain size-full"
                alt={`${alt}`}
                src={src}
                blurDataURL={tumblr}
                placeholder={!!tumblr ? "blur" : "empty"}
                loading="lazy"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
