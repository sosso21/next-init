"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";

import { Review } from "@prisma/client";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Info,
  OctagonMinus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Ranking } from "@/app/components/ranking";
import { Lang } from "@/lib/use-translation/types";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";
import { SimpleTooltip } from "../../components/ui/tooltip";
import { formatDate } from "@/lib/hermes-moment";
import { useConfirmation } from "@/app/components/DialogConfirm/hooks/useConfirmation";
import { deleteReview, ToggleAcceptationReview } from "@/server/review.action";
import { cn } from "@/lib/utils";

type ExpandableCardDemoProps = {
  cards: Review[];
  locale: Lang;
};

export default function ExpandableReviewsCardDemo({
  cards,
  locale,
}: ExpandableCardDemoProps) {
  const t = useClientTranslation("review-dashboard");
  const [active, setActive] = useState<Review | boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => {
    setActive(null);
    setIsExpanded(false);
  });

  const handleToggleAcceptation = async ({
    id,
    isAccepted,
  }: {
    id: number;
    isAccepted: boolean;
  }) => {
    try {
      const isConfirm = await confirm();
      if (!isConfirm) return;
      const result = await ToggleAcceptationReview({
        id,
        accepted: isAccepted,
      }).then((res) => res[0]);
      if (result?.success) {
        await successDialog().then(() => window.location.reload());
      } else {
        throw new Error("ERROR_CREATING_MESSAGE");
      }
    } catch (e) {
      await errorDialog();
    }
  };

  const handleDelete = async ({ id }: { id: number }) => {
    try {
      const isConfirm = await confirm();
      if (!isConfirm) return;
      const result = await deleteReview({
        id,
      }).then((res) => res[0]);
      if (result) {
        await successDialog().then(() => window.location.reload());
      } else {
        throw new Error("ERROR_CREATING_MESSAGE");
      }
    } catch (e) {
      await errorDialog();
    }
  };

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm w-full h-full"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="z-20 fixed inset-0 place-items-center grid">
            <motion.button
              key={`button-${active.title}-${active.id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="top-2 right-2 absolute flex justify-center items-center lg:hidden rounded-full w-6 h-6"
              onClick={() => setActive(null)}
            >
              <X />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${active.id}`}
              ref={ref}
              className="flex flex-col sm:rounded-3xl w-full max-w-[500px] h-full md:h-fit overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${active.id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.profilePicture ?? ""}
                  alt={active.title ?? ""}
                  className="object-top sm:rounded-tl-lg sm:rounded-tr-lg w-full h-80 lg:h-80 object-cover"
                />
              </motion.div>

              <section className="bg-background pb-4">
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`author-${active.author}-${active.id}`}
                      className="font-bold"
                    >
                      {active.author}
                    </motion.h3>
                    <motion.p layoutId={`title-${active.title}-${active.id}`}>
                      {active.title}
                    </motion.p>
                  </div>

                  <span className="flex items-center gap-2">
                    <Button
                      className="border-destructive text-destructive"
                      variant={"outline"}
                      onClick={() => handleDelete({ id: active.id })}
                    >
                      <Trash2 size={"1rem"} />
                    </Button>

                    <Button
                      onClick={() =>
                        handleToggleAcceptation({
                          id: active.id,
                          isAccepted: !active.isAccepted,
                        })
                      }
                      variant={active.isAccepted ? "secondary" : "default"}
                    >
                      {active.isAccepted ? t("reject") : t("accept")}
                    </Button>
                  </span>
                </div>

                <Separator className="mx-auto w-5/6" />

                <ScrollArea
                  className={cn("h-72", {
                    "h-96": isExpanded,
                  })}
                >
                  <div className="relative p-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-start gap-4 pb-10 h-40 md:h-fit text-xs md:text-sm lg:text-base overflow-auto"
                    >
                      <article className="whitespace-pre-line">
                        {active.body}
                      </article>
                    </motion.div>
                  </div>

                  <Ranking
                    onCard
                    locale={locale}
                    serviceQuality={active.serviceQuality as number}
                    responseTime={active.responseTime as number}
                    professionalism={active.professionalism as number}
                    valueForMoney={active.valueForMoney as number}
                    flexibility={active.flexibility as number}
                    rank={active.rank as number}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex justify-center items-center my-2 w-full"
                  >
                    {isExpanded ? t("see-less") : t("see-more")}
                    {isExpanded ? (
                      <ChevronUp size={"1rem"} />
                    ) : (
                      <ChevronDown size={"1rem"} />
                    )}
                  </Button>
                  {isExpanded && (
                    <div className="space-y-4 mt-4 pb-4">
                      <Separator />
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <DetailItem
                          label={t("ip-address")}
                          value={active.ip ?? ""}
                        />
                        <DetailItem
                          label={t("cookies")}
                          value={active.cookies ?? ""}
                        />
                        <DetailItem
                          label={t("user-agent")}
                          value={active.userAgent ?? ""}
                        />
                        <DetailItem
                          label={t("app-version")}
                          value={active.xAppVersion ?? ""}
                        />
                        <DetailItem
                          label={t("account-created")}
                          value={formatDate(active.createdAt, locale)}
                          tooltip={t("account-creation-date")}
                        />
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </section>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="gap-4 mx-auto w-full max-w-2xl min-h-96">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${card.id}`}
            key={`card-${card.title}-${card.id}`}
            onClick={() => setActive(card)}
            className={cn(
              "flex md:flex-row flex-col justify-between justify-items-center items-center hover:bg-secondary hover:text-secondary-foreground p-4 rounded-xl cursor-pointer w-full",
              {
                "border border-primary": !card.validatedByAdmin,
              }
            )}
          >
            <div className="flex md:flex-row flex-col justify-items-center items-center gap-4 w-full">
              <motion.div layoutId={`image-${card.profilePicture}-${card.id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.profilePicture ?? ""}
                  alt={card.title ?? ""}
                  className="object-top rounded-lg w-40 md:w-14 h-40 md:h-14 object-cover"
                />
              </motion.div>
              <div className="">
                <motion.div className="inline-flex items-center mx-2">
                  {card.isAccepted ? (
                    <CheckCheck size="1rem" />
                  ) : (
                    <OctagonMinus size="1rem" />
                  )}
                </motion.div>

                <motion.h3
                  layoutId={`author-${card.author}-${card.id}`}
                  className="inline-flex items-center font-medium text-center md:text-left"
                >
                  {card.author}
                </motion.h3>
                <motion.h4 className="inline-flex justify-start items-center gap-2 mx-4">
                  <span> {card.rank} </span> <Star size="1rem" />
                </motion.h4>
                <motion.p
                  layoutId={`title-${card.title}-${card.id}`}
                  className="text-center md:text-left"
                >
                  {card.title}
                </motion.p>
              </div>
            </div>
            <Button>{t("consult")}</Button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

function DetailItem({
  label,
  value,
  tooltip,
}: {
  label: string;
  value: string;
  tooltip?: string;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-sm">{label}</span>
        {tooltip && (
          <SimpleTooltip message={tooltip}>
            <Info size="1rem" />
          </SimpleTooltip>
        )}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
}
