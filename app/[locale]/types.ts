import { Lang } from '@/lib/use-translation/types';
import { z } from 'zod';

export const localeSchema = z.object({
  locale: z.custom<Lang>(),
});
export const LocaleParamsSchema = z.object({
  params: localeSchema,
});

export const RootChildrenSchema = LocaleParamsSchema.extend({
  children: z.custom<React.ReactNode>(),
});

export type RootChildrenType = z.infer<typeof RootChildrenSchema>;
