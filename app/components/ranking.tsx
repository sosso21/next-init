import { Progress } from "@/components/ui/progress";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { cn } from "@/lib/utils";
import { ShieldCheck, Star } from "lucide-react";
import { CustomMDX } from "./mdx-components";

export const Ranking = ({
  locale,
  onCard = false,
  isGhost = false,
  rank,
  serviceQuality,
  responseTime,
  professionalism,
  valueForMoney,
  flexibility,
}: {
  locale: Lang;
  isGhost?: boolean;
  rank: number;
  serviceQuality: number;
  responseTime: number;
  professionalism: number;
  valueForMoney: number;
  flexibility: number;
  onCard?: boolean;
}) => {
  const t = useServerTranslation(locale, "ranking");

  const evaluations = [
    {
      text: t("serviceQuality"),
      color: "bg-primary",
      value: serviceQuality,
    },
    { text: t("responseTime"), color: "bg-primary", value: responseTime },
    { text: t("professionalism"), color: "bg-primary", value: professionalism },
    { text: t("valueForMoney"), color: "bg-primary", value: valueForMoney },
    { text: t("flexibility"), color: "bg-primary", value: flexibility },
  ];

  return (
    <section
      className={cn(
        "flex flex-wrap justify-center items-center font-normal text-foreground",
        {
          "bg-card text-card-foreground shadow-input mx-auto p-2rounded-none md:rounded-2xl w-full max-w-md":
            onCard,
        }
      )}
    >
      <aside
        className={`flex justify-center text-center items-center my-6 text-4xl md:text-5xl ${
          !!onCard ? "basis-full" : "basis-full md:basis-1/3"
        }`}
      >
        {" "}
        {t("ranking")} {rank}{" "}
        <Star
          className={cn(
            "w-10 md:w-12 h-10 md:h-12 mx-4",
            onCard ? "fill-white" : "fill-foreground"
          )}
        />{" "}
      </aside>
      <ul
        className={`w-full text-sm mx-4 ${
          !!onCard ? "basis-full md:basis-5/6" : "basis-full md:basis-1/2"
        }`}
      >
        {evaluations.map((evaluation, idx) => (
          <li
            key={idx}
            className={cn(
              "flex flex-wrap md:flex-nowrap justify-end items-center w-full"
            )}
          >
            <p className="min-w-36 basis-full md:basis-1/4">
              {evaluation.text}
            </p>
            <span className="flex md:flex-1 justify-end items-center basis-full">
              <Progress
                value={(evaluation.value * 100) / 5}
                className={evaluation.color}
              />
              <span className="px-1"> {evaluation.value}/5 </span>
            </span>
          </li>
        ))}
      </ul>
      {isGhost && (
        <article className="flex justify-center items-center gap-2 my-4 basis-full">
          <ShieldCheck />
          <CustomMDX source={t("authentic-reviews")} />
        </article>
      )}
    </section>
  );
};
