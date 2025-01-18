import { z } from "zod";
import { localeSchema } from "../types";
import { $Enums } from "@prisma/client";

const serviceEnum = $Enums.servicePage;

export const ServiceArray = Object.values(serviceEnum);
export const serviceEnumSchema = z
  .enum(ServiceArray as [string, ...string[]])
  .default(serviceEnum.DEFAULT);

export const localeServiceSchema = localeSchema.extend({
  service: serviceEnumSchema,
});
export const LocaleServiceParamsSchema = z.object({
  params: localeServiceSchema,
});

export const RootServiceChildrenSchema = LocaleServiceParamsSchema.extend({
  children: z.custom<React.ReactNode>(),
});
export type serviceEnumType = z.infer<typeof serviceEnumSchema>;
export type LocaleServiceParamsType = z.infer<typeof LocaleServiceParamsSchema>;
export type RootServiceChildrenType = z.infer<typeof RootServiceChildrenSchema>;
