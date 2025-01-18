import { Lang } from "@/lib/use-translation/types";
import { z } from "zod";
import { imageUrlSchema } from "../../dashboard/upload-images/types";
import { GallerySchema } from "../../galleries/[page]/types";
 
export const localeGallerySlugSchema = z.object({
  locale: z.custom<Lang>(),
  slug: z.string().min(1),
});
export const LocaleGallerySlugParamsSchema = z.object({
  params: localeGallerySlugSchema,
});

export const RootChildrenGallerySlugSchema =
  LocaleGallerySlugParamsSchema.extend({
    children: z.custom<React.ReactNode>(),
  });

export const imageDatabaseSchema = imageUrlSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
  galleries: z.array(GallerySchema).nullable(),
});

export type LocaleGallerySlugParamsType = z.infer<
  typeof LocaleGallerySlugParamsSchema
>;
export type RootChildrenGallerySlugType = z.infer<
  typeof RootChildrenGallerySlugSchema
>;

export type ImageDatabaseType = z.infer<typeof imageDatabaseSchema>;
