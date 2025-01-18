import { z } from "zod";

export const GallerySchema = z.object({
  id: z.number(),
  slug: z.string(),
  private: z.boolean(),
  profilePicture: z.string().nullable(),
});

export type GalleryType = z.infer<typeof GallerySchema>;
