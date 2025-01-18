import { z } from "zod";
import { PageIdSlugSchema } from "../../collaborations/[page]/types";

export const contestWinningCreateOrUpdateSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  picture: z.string().optional(),
  blurPicture: z.string().optional(),
  link: z.string().optional(),
  page: z.array(PageIdSlugSchema).optional(),
  createdAt: z.date().optional(),
});

export type contestWinningCreateOrUpdateType = z.infer<
  typeof contestWinningCreateOrUpdateSchema
>;
