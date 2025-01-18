"use client";

import { Lens } from "@/components/ui/lens";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { parseAsInteger, useQueryState } from "nuqs";

import { useQuery } from "@tanstack/react-query";

import { ownerApp } from "@/constants";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import {
  Check,
  Copy,
  Anchor,
  DownloadIcon,
  ExternalLink,
  ImageOff,
  ImagePlus,
  Images,
  LockKeyhole,
  LockKeyholeOpen,
  Plus,
  Webhook,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SimpleTooltip } from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  addImageToGallery,
  getImage,
  removeFromGallery,
} from "@/server/image.action";
import Link from "next/link";
import { makeImageProfile, searchGalleries } from "@/server/gallery.action";
import {
  backgroundImageIdPageUpdate,
  getPagesForAdmin,
} from "@/server/page.action";
import { useConfirmation } from "./DialogConfirm/hooks/useConfirmation";

export function ImageSettingDialog({
  locale,
  galleryId,
  isAdmin,
}: {
  locale: Lang;
  galleryId?: number;
  isAdmin: boolean;
}) {
  const t = useServerTranslation(locale, "gallery");
  const [imageID, setImageID] = useQueryState("image", parseAsInteger);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string | null>(null);

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const { data, refetch: refetchImage } = useQuery({
    queryKey: ["image", imageID, galleryId],
    queryFn: async () => {
      if (!imageID) return;
      const image = await getImage({
        id: imageID,
        galleryId: galleryId ?? null,
      }).then((res) => res[0]);
      if (image === null) {
        setImageID(null);
        return;
      }
      return image;
    },
    enabled: !!imageID,
    initialData: null,
  });

  const { data: pages, refetch: refetchPages } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const pages = await getPagesForAdmin()
        .then((res) => res[0])
        .catch(() => []);
      return pages;
    },
    initialData: [],
  });

  const { data: galleriesSearch, refetch: refetchGalleries } = useQuery({
    queryKey: ["galleriesSearch", searchInput],
    queryFn: async () => {
      const galleries = await searchGalleries({
        q: searchInput,
        not: (data?.galleries ?? []).map((g) => g.id),
        take: searchInput ? 10 : 5,
      })
        .then((res) => res[0])
        .catch(() => []);
      return galleries;
    },

    initialData: [],
    enabled: !!data?.id,
  });

  const handleRemoveFromGallery = async (galleryID: number) => {
    const isConfirm = await confirm({
      icon: ImageOff,
    });
    if (!isConfirm) return;
    const response = await removeFromGallery({
      imageId: Number(data?.id ?? 0),
      galleryId: galleryID,
    })
      .then((res) => res[0])
      .catch(() => null);

    if (response) {
      await successDialog();
    } else {
      await errorDialog();
    }
    await refetchGalleries();
    await refetchImage();
  };

  const makeImageAsProfilePicture = async (galleryID: number) => {
    const isConfirm = await confirm({
      icon: Anchor,
    });
    if (!isConfirm) return;

    const response = await makeImageProfile({
      imageId: Number(data?.id ?? 0),
      galleryId: galleryID,
    })
      .then((res) => res[0])
      .catch(() => null);

    if (response) {
      await successDialog();
    } else {
      await errorDialog({});
    }
    await refetchGalleries();
    await refetchImage();
  };

  const handleAddToGallery = async (galleryID: number) => {
    const isConfirm = await confirm({
      icon: ImagePlus,
    });
    if (!isConfirm) return;

    const response = await addImageToGallery({
      imageId: Number(data?.id ?? 0),
      galleryId: galleryID,
    })
      .then((res) => res[0])
      .catch(() => null);

    if (response) {
      await successDialog();
    } else {
      await errorDialog({});
      setSearchInput("");
    }
    await refetchGalleries();
    await refetchImage();
  };

  const setAsBackground = async (pageId: number) => {
    const isConfirm = await confirm();

    if (imageID && isConfirm) {
      await backgroundImageIdPageUpdate({
        pageId: pageId,
        imageId: imageID,
      })
        .then(async (res) => {
          if (res[0]) {
            refetchImage();
            refetchPages();
            await successDialog();
          }
        })
        .catch(async () => {
          await errorDialog();
        });
    }
  };

  return (
    <Dialog open={!!imageID} onOpenChange={() => setImageID(null)}>
      <DialogContent className="max-w-[95vw]">
        <DialogHeader> {data?.original} </DialogHeader>
        {data && (
          <section className="flex flex-row lg:flex-row-reverse flex-wrap lg:flex-nowrap justify-center items-start gap-4">
            <aside className="flex flex-wrap justify-start gap-x-2 gap-y-4 h-min basis-full lg:basis-1/6">
              <h2 className="basis-full"> {t("options")} </h2>

              <p
                className={cn(
                  "flex flex-1 text-pretty justify-between items-center rounded-sm bg-secondary text-secondary-foreground p-2",
                  { "bg-secondary/80 text-secondary-foreground/80": linkCopied }
                )}
              >
                <span> {window.location.href} </span>
                <SimpleTooltip asChild message={t("copy-link")}>
                  <Button
                    size="icon"
                    variant={"ghost"}
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setLinkCopied(true);
                      setTimeout(() => {
                        setLinkCopied(false);
                      }, 2000);
                    }}
                  >
                    {linkCopied ? <Check size="1rem" /> : <Copy size="1rem" />}
                  </Button>
                </SimpleTooltip>
              </p>

              <Link
                href={`${data.host}/download/${data.original}`}
                aria-label="download-image"
                download
              >
                <Button variant={"outline"} className="flex gap-2">
                  <DownloadIcon /> <span>{t("download")}</span>
                </Button>
              </Link>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="flex justify-start gap-2 w-full">
                    <Images />
                    <i className="flex-1 text-start">{t("the-galleries")}</i>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
                    {(data?.galleries ?? []).map((gallery) => (
                      <span
                        key={gallery.id}
                        className="flex items-center gap-2 h-full"
                      >
                        {gallery.private ? (
                          <LockKeyhole size={"1rem"} className="mr" />
                        ) : (
                          <LockKeyholeOpen size={"1rem"} className="mr" />
                        )}
                        <span> #{gallery.id} </span>
                        <span className="flex-1 text-start">
                          {gallery.slug}{" "}
                        </span>

                        <SimpleTooltip asChild message={t("view-details")}>
                          <Link
                            href={`/${locale}/gallery/${gallery.slug}`}
                            aria-label={gallery.slug}
                          >
                            <Button size="sm" variant={"ghost"}>
                              <ExternalLink size={"1rem"} />{" "}
                            </Button>
                          </Link>
                        </SimpleTooltip>

                        {isAdmin && (
                          <>
                            <SimpleTooltip asChild message={t("take-off")}>
                              <Button
                                variant={"ghost"}
                                onClick={() =>
                                  handleRemoveFromGallery(gallery.id)
                                }
                              >
                                <ImageOff size={"1rem"} />
                              </Button>
                            </SimpleTooltip>

                            <SimpleTooltip
                              asChild
                              message={t("make-as-profile-image")}
                            >
                              <Button
                                disabled={
                                  `${data.host}/${data?.webp}` ===
                                  gallery.profilePicture
                                }
                                variant={
                                  `${data.host}/${data?.webp}` ===
                                  gallery.profilePicture
                                    ? "default"
                                    : "ghost"
                                }
                                size="sm"
                                onClick={() =>
                                  makeImageAsProfilePicture(gallery.id)
                                }
                              >
                                <Anchor size={"1rem"} />
                              </Button>
                            </SimpleTooltip>
                          </>
                        )}
                      </span>
                    ))}
                  </AccordionContent>
                </AccordionItem>
                {isAdmin && (
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="flex justify-start gap-2 w-full">
                      <Plus />
                      <i className="flex-1 text-start">
                        {t("add-to-galleries")}
                      </i>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                      <Input
                        type="search"
                        placeholder={t("search-galleries")}
                        onChange={async (
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setSearchInput(event.target.value);
                        }}
                        value={searchInput ?? ""}
                      />

                      {(galleriesSearch ?? []).map((gallery: any) => (
                        <div
                          key={gallery?.id}
                          className="flex items-center gap-2"
                        >
                          {gallery.private ? (
                            <LockKeyhole size={"1rem"} className="mr" />
                          ) : (
                            <LockKeyholeOpen size={"1rem"} className="mr" />
                          )}
                          <span> #{gallery.id} </span>
                          <span className="flex-1 text-start">
                            {gallery.slug}
                          </span>

                          <SimpleTooltip asChild message={t("add-to-gallery")}>
                            <Button
                              size="sm"
                              variant={"ghost"}
                              onClick={() => handleAddToGallery(gallery.id)}
                            >
                              <ImagePlus size={"1rem"} />
                            </Button>
                          </SimpleTooltip>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}

                {isAdmin && (
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="flex justify-start gap-2 w-full">
                      <Webhook />
                      <i className="flex-1 text-start">
                        {t("make-as-background")}
                      </i>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4">
                      {(pages ?? []).map((page) => (
                        <div
                          key={page.id}
                          className="flex justify-between items-center gap-2"
                        >
                          <span className="capitalize"> {t(page.slug)} </span>
                          <SimpleTooltip
                            asChild
                            message={t("make-as-background")}
                          >
                            <Button
                              size="sm"
                              disabled={data.id == page.backgroundImageId}
                              variant={
                                data.id == page.backgroundImageId
                                  ? "default"
                                  : "ghost"
                              }
                              onClick={() => setAsBackground(page.id)}
                            >
                              <Webhook size={"1rem"} />
                            </Button>
                          </SimpleTooltip>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </aside>
            <div className="flex-1 basis-full lg:basis-2/3 min-w96">
              <LensDemoThird
                src={`${data?.host}/${data?.original}`}
                alt={`image of ${ownerApp} - id: ${data?.id}`}
                blurDataURL={`${data?.host}/${data?.tumblr}`}
              />
            </div>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function LensDemoThird(props: ImageProps) {
  return (
    <Lens>
      <div className="bg-gradient-to-r from-[#1D2235] to-[#121318] rounded-3xl overflow-hidden">
        <Rays />
        <Beams />
        <div className="relative m-auto w-sm min-h-[50vh] lg:min-h-[70vh]">
          <Image
            {...props}
            src={props.src}
            alt={props.alt}
            blurDataURL={props.blurDataURL}
            placeholder="blur"
            fill
            className="rounded-2xl object-contain"
          />
        </div>
      </div>
    </Lens>
  );
}

// Sorry about this but it looks cool

const Beams = () => {
  return (
    <svg
      width="380"
      height="315"
      viewBox="0 0 380 315"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="top-0 left-1/2 absolute w-full -translate-x-1/2 pointer-events-none"
    >
      <g filter="url(#filter0_f_120_7473)">
        <circle cx="34" cy="52" r="114" fill="#6925E7" />
      </g>
      <g filter="url(#filter1_f_120_7473)">
        <circle cx="332" cy="24" r="102" fill="#8A4BFF" />
      </g>
      <g filter="url(#filter2_f_120_7473)">
        <circle cx="191" cy="53" r="102" fill="#802FE3" />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7473"
          x="-192"
          y="-174"
          width="452"
          height="452"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="56"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter1_f_120_7473"
          x="70"
          y="-238"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
        <filter
          id="filter2_f_120_7473"
          x="-71"
          y="-209"
          width="524"
          height="524"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="80"
            result="effect1_foregroundBlur_120_7473"
          />
        </filter>
      </defs>
    </svg>
  );
};

const Rays = ({ className }: { className?: string }) => {
  return (
    <svg
      width="380"
      height="397"
      viewBox="0 0 380 397"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "absolute left-0 top-0  pointer-events-none z-[1]",
        className
      )}
    >
      <g filter="url(#filter0_f_120_7480)">
        <path
          d="M-37.4202 -76.0163L-18.6447 -90.7295L242.792 162.228L207.51 182.074L-37.4202 -76.0163Z"
          fill="url(#paint0_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.3"
        filter="url(#filter1_f_120_7480)"
      >
        <path
          d="M-109.54 -36.9027L-84.2903 -58.0902L178.786 193.228L132.846 223.731L-109.54 -36.9027Z"
          fill="url(#paint1_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.86"
        filter="url(#filter2_f_120_7480)"
      >
        <path
          d="M-100.647 -65.795L-69.7261 -92.654L194.786 157.229L139.51 197.068L-100.647 -65.795Z"
          fill="url(#paint2_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        opacity="0.31"
        filter="url(#filter3_f_120_7480)"
      >
        <path
          d="M163.917 -89.0982C173.189 -72.1354 80.9618 2.11525 34.7334 30.1553C-11.495 58.1954 -106.505 97.514 -115.777 80.5512C-125.048 63.5885 -45.0708 -3.23233 1.15763 -31.2724C47.386 -59.3124 154.645 -106.061 163.917 -89.0982Z"
          fill="#8A50FF"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter4_f_120_7480)"
      >
        <path
          d="M34.2031 13.2222L291.721 269.534"
          stroke="url(#paint3_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter5_f_120_7480)"
      >
        <path
          d="M41 -40.9331L298.518 215.378"
          stroke="url(#paint4_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter6_f_120_7480)"
      >
        <path
          d="M61.3691 3.8999L317.266 261.83"
          stroke="url(#paint5_linear_120_7480)"
        />
      </g>
      <g
        style={{ mixBlendMode: "plus-lighter" }}
        filter="url(#filter7_f_120_7480)"
      >
        <path
          d="M-1.46191 9.06348L129.458 145.868"
          stroke="url(#paint6_linear_120_7480)"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_120_7480"
          x="-49.4199"
          y="-102.729"
          width="304.212"
          height="296.803"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="6"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter1_f_120_7480"
          x="-115.54"
          y="-64.0903"
          width="300.326"
          height="293.822"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter2_f_120_7480"
          x="-111.647"
          y="-103.654"
          width="317.434"
          height="311.722"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter3_f_120_7480"
          x="-212.518"
          y="-188.71"
          width="473.085"
          height="369.366"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="48"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter4_f_120_7480"
          x="25.8447"
          y="4.84521"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter5_f_120_7480"
          x="32.6416"
          y="-49.3101"
          width="274.234"
          height="273.065"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="4"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter6_f_120_7480"
          x="54.0078"
          y="-3.47461"
          width="270.619"
          height="272.68"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <filter
          id="filter7_f_120_7480"
          x="-9.2002"
          y="1.32812"
          width="146.396"
          height="152.275"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3.5"
            result="effect1_foregroundBlur_120_7480"
          />
        </filter>
        <linearGradient
          id="paint0_linear_120_7480"
          x1="-57.5042"
          y1="-134.741"
          x2="403.147"
          y2="351.523"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#B253FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_120_7480"
          x1="-122.154"
          y1="-103.098"
          x2="342.232"
          y2="379.765"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#AF53FF" />
          <stop offset="0.781583" stopColor="#9E53FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_120_7480"
          x1="-106.717"
          y1="-138.534"
          x2="359.545"
          y2="342.58"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.214779" stopColor="#9D53FF" />
          <stop offset="0.781583" stopColor="#A953FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_120_7480"
          x1="72.701"
          y1="54.347"
          x2="217.209"
          y2="187.221"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_120_7480"
          x1="79.4978"
          y1="0.191681"
          x2="224.006"
          y2="133.065"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AF81FF" />
          <stop offset="1" stopColor="#C081FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_120_7480"
          x1="79.6568"
          y1="21.8377"
          x2="234.515"
          y2="174.189"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B981FF" />
          <stop offset="1" stopColor="#CF81FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_120_7480"
          x1="16.119"
          y1="27.6966"
          x2="165.979"
          y2="184.983"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A981FF" />
          <stop offset="1" stopColor="#CB81FF" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
