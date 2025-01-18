"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ContestWinning } from "@prisma/client";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import {
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Pen,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Lang } from "@/lib/use-translation/types";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Separator } from "../../components/ui/separator";

import { Input } from "@/components/ui/input";
import { PageIdSlugType } from "../[locale]/dashboard/collaborations/[page]/types";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProfilePictureUploader } from "@/components/profile-picture-uploader";
import { FileType, handleFileUpload } from "@/lib/images-uploader";
import { createId } from "@paralleldrive/cuid2";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useConfirmation } from "./DialogConfirm/hooks/useConfirmation";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import {
  contestWinningCreateOrUpdateSchema,
  contestWinningCreateOrUpdateType,
} from "../[locale]/dashboard/contest-winning/[page]/types";
import {
  createOrUpdateContestWinning,
  deleteContestWinning,
} from "@/server/ContestWinning.action";

type ExpandableCardDemoProps = {
  cards: ContestWinning[];
  locale: Lang;
  pages: PageIdSlugType[];
};

export default function ExpandableContestWinningsCardDemo({
  cards,
  locale,
  pages,
}: ExpandableCardDemoProps) {
  const t = useClientTranslation("contest-winning-dashboard");
  const [active, setActive] = useState<ContestWinning | boolean | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [file, setFile] = useState<FileType | null>(null);

  const defaultValues: contestWinningCreateOrUpdateType = {
    id: undefined,
    title: "",
    description: "",
    picture: "",
    blurPicture: "",
    link: "",
    page: [],
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    // setError,
    getValues,
    // watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<contestWinningCreateOrUpdateType>({
    resolver: zodResolver(contestWinningCreateOrUpdateSchema),
    defaultValues: defaultValues,
  });
  const { id, title, description, picture, blurPicture, link, page } = useWatch(
    {
      control,
    }
  );

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
    reset();
    setFile(null);
  });

  const onSubmitForm: SubmitHandler<contestWinningCreateOrUpdateType> = async (
    data
  ) => {
    const isConfirm = await confirm();
    if (!isConfirm) return;

    try {
      if (file != null && file.uploaded === false) {
        const image = await handleFileUpload([file]);
        if (image.length > 0 && image[0].urls) {
          data.picture = `${image[0].urls.host}/${image[0].urls.webp}`;
          data.blurPicture = `${image[0].urls.host}/${image[0].urls.tumblr}`;

          setFile(null);
        }
      }
      const result = await createOrUpdateContestWinning(data).then(
        (res) => res[0]
      );
      if (result) {
        await successDialog().then(() => window.location.reload());
      } else {
        throw new Error("ERROR_CREATING_MESSAGE");
      }
    } catch {
      await errorDialog();
    }
  };

  const handleDelete = async ({ id }: { id: number }) => {
    try {
      const isConfirm = await confirm();
      if (!isConfirm) return;
      const result = await deleteContestWinning({
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

  const handleExpend = () => {
    if (!isExpanded && active != null && typeof active === "object") {
      Object.keys(active).forEach((key) => {
        setValue(
          key as keyof contestWinningCreateOrUpdateType,
          (active as contestWinningCreateOrUpdateType)[
            key as keyof contestWinningCreateOrUpdateType
          ]
        );
      });
      setValue(
        "page",
        ((active as any)?.page ?? []).map(
          (p: { id: number; slug: string }) => ({
            id: p.id,
            slug: p.slug,
          })
        )
      );
    } else {
      reset();
    }

    setFile(null);
    setIsExpanded(!isExpanded);
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
          <div className={cn("z-20 fixed inset-0 place-items-center grid")}>
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
              {active.picture && (
                <motion.div layoutId={`image-${active.title}-${active.id}`}>
                  <Image
                    priority
                    width={200}
                    height={200}
                    src={active.picture ?? ""}
                    alt={active.title ?? ""}
                    className="object-top sm:rounded-tl-lg sm:rounded-tr-lg w-full h-80 lg:h-80 object-cover"
                  />
                </motion.div>
              )}

              <section className="bg-background pb-4">
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${active.id}`}
                      className="font-bold"
                    >
                      {active.title}
                    </motion.h3>
                    {active.link && (
                      <motion.a
                        href={active.link}
                        aria-label={active.title}
                        target="_blank"
                        layoutId={`link-${active.link ?? ""}--${active.id}`}
                        className="max-w-96 text-ellipsis text-sm whitespace-nowrap overflow-hidden"
                      >
                        {active.link}
                      </motion.a>
                    )}
                  </div>

                  {active.id && (
                    <Button
                      className="border-destructive text-destructive"
                      variant={"outline"}
                      onClick={() => handleDelete({ id: active.id })}
                    >
                      <Trash2 size={"1rem"} />
                    </Button>
                  )}
                </div>

                <Separator className="mx-auto w-5/6" />

                <ScrollArea
                  className={cn("min-h-72 w-full", {
                    "h-96": isExpanded,
                    "w-[90%]": isExpanded && (!id || !active.picture),
                  })}
                >
                  <div className="relative p-4">
                    <motion.div
                      layout
                      layoutId={`description-${active.description}-${active.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="[mask:linear-gradient(to_bottom,white,white,transparent)] flex flex-col items-start gap-4 pb-10 h-40 md:h-fit text-xs md:text-sm lg:text-base overflow-auto [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [scrollbar-width:none]"
                    >
                      <article className="whitespace-pre-line">
                        {active.description}
                      </article>
                    </motion.div>
                  </div>
                  {!!active.id && (
                    <Button
                      variant="ghost"
                      onClick={handleExpend}
                      className="flex justify-center items-center gap-2 mx-auto"
                    >
                      <Pen size="1rem" />
                      {t("edit")}
                      {isExpanded ? (
                        <ChevronUp size="1rem" />
                      ) : (
                        <ChevronDown size="1rem" />
                      )}
                    </Button>
                  )}

                  {(isExpanded || !active.id) && (
                    <form
                      onSubmit={handleSubmit(onSubmitForm)}
                      className="flex flex-col gap-6"
                    >
                      <span className="flex flex-col gap-1 px-2">
                        <Label htmlFor="title"> {t("title")} </Label>
                        <Input type="text" id="title" {...register("title")} />
                      </span>

                      <span className="flex flex-col gap-1 px-2">
                        <Label htmlFor="description">
                          {" "}
                          {t("description")}{" "}
                        </Label>
                        <Textarea
                          rows={5}
                          id="description"
                          {...register("description")}
                        />
                      </span>

                      <span className="flex flex-col gap-1 px-2">
                        <Label htmlFor="link"> {t("link")} </Label>
                        <Input type="text" id="link" {...register("link")} />
                      </span>

                      <ProfilePictureUploader
                        setFile={(INPUTfILE) =>
                          setFile({
                            file: INPUTfILE,
                            id: createId(),
                            uploaded: false,
                          })
                        }
                        url={
                          file?.file
                            ? URL.createObjectURL(file.file)
                            : picture ?? null
                        }
                        className={cn("rounded-md", {
                          "border border-destructive text-destructive":
                            !file?.file && !picture,
                        })}
                      />
                      <ul className="flex flex-col gap-2 px-4">
                        {pages.map((p) => (
                          <li
                            key={p.id}
                            className="flex justify-between items-center w-full"
                          >
                            <span>{t(`${p.slug}`)}</span>
                            <Button
                              type="button"
                              variant={
                                page?.find((pp) => pp.id === p.id)
                                  ? "default"
                                  : "outline"
                              }
                              size="icon"
                              onClick={() =>
                                setValue(
                                  "page",
                                  (
                                    ((page as PageIdSlugType[]) ??
                                      []) as PageIdSlugType[]
                                  )?.find(
                                    (pp: PageIdSlugType) => pp.id === p.id
                                  )
                                    ? (
                                        (page as PageIdSlugType[]) ??
                                        ([] as PageIdSlugType[])
                                      )?.filter(
                                        (pp: PageIdSlugType) => pp.id !== p.id
                                      )
                                    : ([
                                        ...(page ?? ([] as PageIdSlugType[])),
                                        p,
                                      ] as PageIdSlugType[])
                                )
                              }
                            >
                              <CheckCheck size={"1rem"} />
                            </Button>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="self-center"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {t("submit")}
                      </Button>
                    </form>
                  )}
                </ScrollArea>
              </section>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div className="flex justify-start items-center gap-4 mx-auto w-full max-w-2xl">
        <Button
          variant={"ghost"}
          onClick={() => {
            handleExpend();
            setActive(defaultValues as ContestWinning);
          }}
          className="flex justify-center items-center gap-2"
        >
          <Plus size="1rem" />
          <span>{t("add")}</span>
        </Button>
      </motion.div>
      <ul className="gap-4 mx-auto w-full max-w-2xl min-h-96">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${card.id}`}
            key={`card-${card.title}-${card.id}`}
            onClick={() => {
              setActive(card);

              setIsExpanded(false);
              reset();
              setFile(null);
            }}
            className={
              "flex gap-x-4 md:flex-row flex-col items-center hover:bg-secondary hover:text-secondary-foreground p-4 rounded-xl cursor-pointer justify-between w-full"
            }
          >
            <div className="flex md:flex-row flex-col justify-items-center items-center gap-4 w-full">
              <motion.div
                layoutId={`image-${card.blurPicture}-${card.id}`}
                className="relative w-40 md:w-14 h-40 md:h-14"
              >
                <Image
                  fill
                  src={card.picture ?? ""}
                  alt={card.title ?? ""}
                  blurDataURL={card.blurPicture ?? ""}
                  placeholder={card.blurPicture ? "blur" : "empty"}
                  className="object-top rounded-lg w-40 md:w-14 h-40 md:h-14 object-cover"
                />
              </motion.div>
              <div className="w-60">
                <motion.h3
                  layoutId={`title-${card.title}-${card.id}`}
                  className="inline-flex items-center font-medium text-center md:text-left"
                >
                  {card.title}
                </motion.h3>

                <motion.p
                  layoutId={`description-${card.description}-${card.id}`}
                  className="w-3/5 text-center text-ellipsis md:text-left whitespace-nowrap overflow-hidden"
                >
                  {card.description}
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
