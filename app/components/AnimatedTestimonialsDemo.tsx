import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { Lang } from "@/lib/use-translation/types";
import { $Enums } from "@prisma/client";
import { serviceEnumType } from "../[locale]/[service]/types";
import { prisma } from "@/lib/prisma";
import { stringToSlug } from "@/lib/stingToSlug";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";

export async function AnimatedTestimonialsDemo({
  locale,
  route = $Enums.servicePage.DEFAULT,
}: {
  locale: Lang;
  route?: serviceEnumType;
}) {
  const t = useServerTranslation(locale, "animated-testimonials");

  const testimonials = await prisma.page
    .findFirst({
      where: {
        slug: stringToSlug(`${route}`),
      },
      include: {
        collaboration: true,
      },
    })
    .then((res) =>
      res?.collaboration.map((item) => ({
        id: item.id,
        link: item.link,
        title: item.title,
        description: item.description,
        picture: item.picture,
        blurPicture: item.blurPicture,
      }))
    );
  if (testimonials?.length) {
    return (
      <section className="flex flex-wrap justify-center items-center my-8 w-full">
        <h3 className="mx-auto my-8 w-full text-2xl text-center">
          {" "}
          {t("our-collaborators")}{" "}
        </h3>
        <AnimatedTestimonials testimonials={testimonials ?? []} autoplay />
      </section>
    );
  } else {
    return <></>;
  }
}
