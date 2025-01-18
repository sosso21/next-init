import { Lang } from "@/lib/use-translation/types";
import { CustomMDX } from "./mdx-components";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { serviceEnumType } from "../[locale]/[service]/types";
import { $Enums } from "@prisma/client";

export function GridTextService({
  locale,
  route = $Enums.servicePage.DEFAULT,
}: {
  locale: Lang;
  route?: serviceEnumType;
}) {
  const t = useServerTranslation(locale, "grid-text-service");

  const routeServices: Record<
    serviceEnumType,
    { title: string; description: string }[]
  > = {
    DEFAULT: [
      {
        title: t("default-service-1-title"),
        description: t("default-service-1-description"),
      },
      {
        title: t("default-service-2-title"),
        description: t("default-service-2-description"),
      },
      {
        title: t("default-service-3-title"),
        description: t("default-service-3-description"),
      },
      {
        title: t("default-service-4-title"),
        description: t("default-service-4-description"),
      },
    ],
    MARRIAGE: [
      {
        title: t("marriage-service-1-title"),
        description: t("marriage-service-1-description"),
      },
      {
        title: t("marriage-service-2-title"),
        description: t("marriage-service-2-description"),
      },
      {
        title: t("marriage-service-3-title"),
        description: t("marriage-service-3-description"),
      },
    ],
    PORTRAIT: [
      {
        title: t("portrait-service-1-title"),
        description: t("portrait-service-1-description"),
      },
      {
        title: t("portrait-service-2-title"),
        description: t("portrait-service-2-description"),
      },
      {
        title: t("portrait-service-3-title"),
        description: t("portrait-service-3-description"),
      },
    ],
    EVENT: [
      {
        title: t("event-service-1-title"),
        description: t("event-service-1-description"),
      },
      {
        title: t("event-service-2-title"),
        description: t("event-service-2-description"),
      },
      {
        title: t("event-service-3-title"),
        description: t("event-service-3-description"),
      },
    ],
    ENTERPRISE: [
      {
        title: t("enterprise-service-1-title"),
        description: t("enterprise-service-1-description"),
      },
      {
        title: t("enterprise-service-2-title"),
        description: t("enterprise-service-2-description"),
      },
      {
        title: t("enterprise-service-3-title"),
        description: t("enterprise-service-3-description"),
      },
    ],
    PREGNANCY: [
      {
        title: t("pregnancy-service-1-title"),
        description: t("pregnancy-service-1-description"),
      },
      {
        title: t("pregnancy-service-2-title"),
        description: t("pregnancy-service-2-description"),
      },
      {
        title: t("pregnancy-service-3-title"),
        description: t("pregnancy-service-3-description"),
      },
    ],
  };

  const paragraphs = routeServices[route];

  return (
    <section className="flex flex-wrap justify-around items-around gap-x-4 gap-y-8 my-5 md:my-20 w-full">
      {(paragraphs ?? []).map(({ title, description }, idx) => (
        <li
          key={idx}
          className="mx-auto max-w-80 list-none basis-full md:basis-1/2 lg:basis-1/3"
        >
          <h4 className="mx-auto my-2 text-2xl text-center"> {title}</h4>

          <article className="font-light text-lg">
            <CustomMDX source={description} />
          </article>
        </li>
      ))}
    </section>
  );
}
