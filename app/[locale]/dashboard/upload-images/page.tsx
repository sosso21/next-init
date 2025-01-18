"use client";

import { Footer } from "@/app/components/footer";
import { GalleryDataTable } from "@/app/components/GalleryDataTable";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { parseAsInteger, useQueryState } from "nuqs";
import { MouseEvent, useState } from "react";

import { uploadImageToGallery } from "@/server/gallery.action";
import { galleryFromSchema, ImageUrlType } from "./types";
import { LocaleParamsType } from "../../types";
import { useConfirmation } from "@/app/components/DialogConfirm/hooks/useConfirmation";

export default function Home({ params }: LocaleParamsType) {
  const [gallery] = useQueryState("gallery", parseAsInteger);
  const t = useClientTranslation("common");

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const [imageUrls, setImageUrls] = useState<ImageUrlType[]>([]);
  const [loading, setLoading] = useState(false);
  const [galleries, setGalleries] = useState<Record<string, boolean>>(
    gallery ? { [`${gallery}`]: true } : {}
  );

  const handleSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const safeGalleries = Object.keys(galleries).map((g) => Number(g));
      galleryFromSchema.parse({
        imageUrls: imageUrls,
        galleries: safeGalleries,
      });

      if (imageUrls.length === 0 || safeGalleries.length === 0) {
        throw new Error("no_images_selected");
      }

      const isConfirmed = await confirm({});
      if (!isConfirmed) {
        return;
      }

      const response = await uploadImageToGallery({
        imageUrls: imageUrls,
        galleries: safeGalleries,
      });

      if (response[0]?.success) {
        await successDialog().then(() => window.location.reload());
      } else {
        throw new Error("error_uploading_images");
      }
    } catch (error) {
      await errorDialog();
    }
  };

  return (
    <main className="flex flex-col justify-between mx-auto p-4 w-full max-w-4xl h-full min-h-screen">
      <GalleryDataTable
        addToFirstChecked={gallery !== null}
        checked={galleries}
        setChecked={setGalleries}
      />
      <FileUpload setLoading={setLoading} setUrls={setImageUrls} multiple />
      <div className="flex justify-center mt-4 w-full">
        <Button
          disabled={
            loading ||
            imageUrls.length === 0 ||
            Object.keys(galleries).length === 0
          }
          onClick={handleSubmit}
        >
          {t("save")}
        </Button>
      </div>

      <Footer
        className="z-10 bg-background p-2 w-full"
        locale={params.locale}
      />
    </main>
  );
}
