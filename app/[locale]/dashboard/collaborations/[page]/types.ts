import { z } from "zod";

export const PageIdSlugSchema = z.object({
  id: z.number(),
  slug: z.string().optional(),
});

export const CollaborationCreateOrUpdateSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  picture: z.string(),
  blurPicture: z.string().optional(),
  link: z.string().optional(),
  page: z.array(PageIdSlugSchema).optional(),
  createdAt: z.date().optional(),
});

export type CollaborationCreateOrUpdateType = z.infer<
  typeof CollaborationCreateOrUpdateSchema
>;
export type PageIdSlugType = z.infer<typeof PageIdSlugSchema>;
