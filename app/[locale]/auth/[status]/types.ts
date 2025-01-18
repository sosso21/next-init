import { z } from "zod";
import { localeSchema } from "../../types";

export const statusEnumArray = ["success", "error"] as const;

export const localeAuthStatusSchema = localeSchema.extend({
  status: z.enum(statusEnumArray),
});
export const localeAuthStatusParamsSchema = z.object({
  params: localeAuthStatusSchema,
});

export const localeAuthStatusRootChildrenSchema =
  localeAuthStatusParamsSchema.extend({
    children: z.custom<React.ReactNode>(),
  });

export type LocaleAuthStatusRootChildrenType = z.infer<
  typeof localeAuthStatusRootChildrenSchema
>;
export type LocaleAuthStatusParamsType = z.infer<
  typeof localeAuthStatusParamsSchema
>;
