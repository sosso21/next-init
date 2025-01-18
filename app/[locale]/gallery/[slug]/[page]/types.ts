import { Lang } from "@/lib/use-translation/types";
import { z } from "zod";

export const localeGallerySlugPaginationSchema = z.object({
  locale: z.custom<Lang>(),
  slug: z.string().min(1),
  page: z.preprocess((value) => {
    const num = Number(value);
    return isNaN(num) || num < 1 ? 1 : num;
  }, z.number().min(1)),
});
export const LocaleGallerySlugPaginationParamsSchema = z.object({
  params: localeGallerySlugPaginationSchema,
});

export const RootChildrenGallerySlugPaginationSchema =
  LocaleGallerySlugPaginationParamsSchema.extend({
    children: z.custom<React.ReactNode>(),
  });

export type LocaleGallerySlugPaginationParamsType = z.infer<
  typeof LocaleGallerySlugPaginationParamsSchema
>;
export type RootChildrenGallerySlugPaginationType = z.infer<
  typeof RootChildrenGallerySlugPaginationSchema
>;
