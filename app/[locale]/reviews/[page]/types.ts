import { Lang } from "@/lib/use-translation/types";
import { localeSchema } from "../../types";
import { z } from "zod";

export const localePaginationSchema = localeSchema.extend({
  locale: z.custom<Lang>(),
  page: z.preprocess((value) => {
    const num = Number(value);
    return isNaN(num) || num < 1 ? 1 : num;
  }, z.number().min(1)),
});
export const LocalePaginationParamsSchema = z.object({
  params: localePaginationSchema,
});

export const RootPaginationChildrenSchema = LocalePaginationParamsSchema.extend(
  {
    children: z.custom<React.ReactNode>(),
  }
);

export type LocalePaginationParamsType = z.infer<
  typeof LocalePaginationParamsSchema
>;
export type RootPaginationChildrenType = z.infer<
  typeof RootPaginationChildrenSchema
>;
