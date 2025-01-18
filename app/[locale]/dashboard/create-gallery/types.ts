import { serviceEnumSchema } from "./../../[service]/types";
import { Prisma } from "@prisma/client";
import { z } from "zod";

export const userSearchSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  username: z.string().nullable(),
  image: z.string().nullable(),
});

export const createOrUpdateGallerySchema = z.object({
  id: z.number().optional(),
  slug: z
    .string({
      required_error: "SLUG_IS_REQUIRED",
      invalid_type_error: "SLUG_IS_REQUIRED",
    })
    .min(1, "SLUG_IS_TOO_SHORT")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),

  profilePicture: z.string().url(),
  tumblrProfilePicture: z.string().url().nullable(),
  private: z.boolean().default(true),
  category: serviceEnumSchema,
});

export type createOrUpdateGalleryType = z.infer<
  typeof createOrUpdateGallerySchema
>;
