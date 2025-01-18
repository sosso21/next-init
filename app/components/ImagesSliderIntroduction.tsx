import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Slider } from "./Slider";
import { Lang } from "@/lib/use-translation/types";
import { CustomMDX } from "./mdx-components";
import { serviceEnumType } from "../[locale]/[service]/types";
import { $Enums } from "@prisma/client";

export function ImagesSliderIntroduction({
  locale,
  service = $Enums.servicePage.DEFAULT,
}: {
  locale: Lang;
  service?: serviceEnumType;
}) {
  const t = useServerTranslation(locale, "introduction");

  return (
    <section className="flex flex-wrap justify-center items-center my-8 w-full">
      <div className="flex-1 my-4 px-2 max-w-96 md:basis-1/2 lg:basis-1/3">
        <h3 className="mx-auto my-2 text-2xl"> {t("title")} </h3>
        <article className="font-light text-lg">
          <CustomMDX source={t("description")} />
        </article>
      </div>

      <aside className="flex flex-1 justify-center">
        <Slider route={service} />
      </aside>
    </section>
  );
}
