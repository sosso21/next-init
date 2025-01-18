import { z } from "zod";

export const ImagePropsSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export const BoxesServiceSchema = ImagePropsSchema.extend({
  href: z.string(),
  title: z.string(),
  description: z.string(),
});

export type ImagePropsType = z.infer<typeof ImagePropsSchema>;
export type BoxesServiceType = z.infer<typeof BoxesServiceSchema>;
