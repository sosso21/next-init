import { prisma } from "@/lib/prisma";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";
import { formatElapsedTime } from "@/lib/hermes-moment";
import { ArrowLeft, History, ImageOff, ImageUp } from "lucide-react";
import { redirect } from "next/navigation";
import { Footer } from "@/app/components/footer";
import { $Enums } from "@prisma/client";
import { auth } from "@/auth";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Button } from "@/components/ui/button";
import { Lang } from "@/lib/use-translation/types";
import { ImageSettingDialog } from "@/app/components/ImageSettingDialog";
import { Suspense } from "react";
import Link from "next/link";
import {
  LocaleGallerySlugPaginationParamsType,
  localeGallerySlugPaginationSchema,
} from "./types";
import { SmartPagination } from "@/app/components/paginationDemo";

function ComeBackButton({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "gallery");

  return (
    <Link href={`/${locale}/galleries`} aria-label="come back">
      <Button variant={"ghost"} className="flex items-center gap-2">
        <ArrowLeft size="sm" />
        <span>{t("come-back")}</span>
      </Button>
    </Link>
  );
}

export default async function Home({
  params,
}: LocaleGallerySlugPaginationParamsType) {
  const t = useServerTranslation(params.locale, "gallery");
  const session = await auth();
  const userSession = session?.user as any;
  const take = 10;
  const safeParams = localeGallerySlugPaginationSchema.parse(params);

  const gallery = await prisma.gallery.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      images: {
        take: take,
        skip: (safeParams.page - 1) * take,
      },
      users: true,
    },
  });

  const count = await prisma.image.count({
    where: {
      galleries: {
        some: {
          slug: params.slug,
        },
      },
    },
  });

  if (
    !gallery ||
    (gallery.private &&
      (!userSession ||
        gallery.users.includes(userSession.id) ||
        !userSession.role.includes($Enums.role.ADMIN)))
  ) {
    return redirect(`/${params.locale}/galleries`);
  }

  return (
    <main className="flex flex-col justify-between w-full min-h-screen">
      <section className="flex justify-around items-center my-8 px-2 w-full">
        <h1 className="text-2xl">{gallery.slug} </h1>

        {(userSession?.role ?? []).includes($Enums.role.ADMIN) ? (
          <Link
            href={`/${params.locale}/dashboard/upload-images?gallery=${gallery.id}`}
            aria-label="upload-image"
          >
            <Button className="flex items-center gap-2">
              <ImageUp size="sm" />
              <span>{t("upload")}</span>
            </Button>
          </Link>
        ) : null}
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <ImageSettingDialog
          locale={params.locale}
          galleryId={gallery.id}
          isAdmin={(userSession?.role ?? []).includes($Enums.role.ADMIN)}
        />
      </Suspense>

      {gallery.images.length == 0 ? (
        <section className="flex flex-col justify-center items-center gap-4 min-h-[40rem]">
          <ImageOff size={64} />
          <h1 className="text-2xl md:text-6xl">{t("no-images")}</h1>
          <article className="max-w-screen-sm">
            {t("no-images-description")}
          </article>
          <div className="flex justify-center items-center gap-4">
            <ComeBackButton locale={params.locale} />

            <Link
              href={`/${params.locale}/dashboard/contact-us?subject=COMPLAINT_OR_TECHNICAL_ISSUE`}
              aria-label={t("contact-us")}
            >
              <Button> {t("contact-us")} </Button>
            </Link>
          </div>
        </section>
      ) : (
        <section className="flex flex-wrap justify-center items-start gap-4 my-12 min-h-[40rem]">
          {gallery.images.reverse().map((image) => (
            <Link
              href={`/${params.locale}/gallery/${gallery.slug}/${safeParams.page}?image=${image.id}`}
              aria-label={`image ${image.id}`}
              key={image.id}
              className="relative"
            >
              <DirectionAwareHover
                imageProps={{
                  src: `${image.host}/${image.webp}`,
                  alt: `${gallery.slug} ${image.id}`,
                  blurDataURL: `${image.host}/${image.tumblr}`,
                  placeholder: "blur",
                }}
              >
                <p className="font-bold text-xl"> #{image.id} </p>
                <p className="flex items-center gap-2 font-normal text-sm">
                  <History />
                  {formatElapsedTime({
                    date: image.createdAt,
                    locale: params.locale,
                  })}{" "}
                </p>
              </DirectionAwareHover>
            </Link>
          ))}

          <SmartPagination
            hasPreviousPage={safeParams.page > 1}
            hasNextPage={safeParams.page * take < count}
            count={count}
            currentPage={safeParams.page}
            link={`/${safeParams.locale}/gallery/${safeParams.slug}`}
            take={take}
            className="mt-4"
          />
        </section>
      )}
      <Footer locale={params.locale} />
    </main>
  );
}
