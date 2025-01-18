import { z } from "zod";

export const galleriesCountSchema = z.array(
  z.number({
    required_error: "GALLERY_IS_REQUIRED",
    invalid_type_error: "GALLERY_IS_REQUIRED",
  })
);

export const imageUrlSchema = z.object({
  original: z.string({
    required_error: "ORIGINAL_IMAGE_IS_REQUIRED",
    invalid_type_error: "ORIGINAL_IMAGE_IS_REQUIRED",
  }),
  webp: z.string({
    required_error: "WEBP_IMAGE_IS_REQUIRED",
    invalid_type_error: "WEBP_IMAGE_IS_REQUIRED",
  }),
  tumblr: z.string({
    required_error: "TUMBLR_IMAGE_IS_REQUIRED",
    invalid_type_error: "TUMBLR_IMAGE_IS_REQUIRED",
  }),
  host: z
    .string({
      required_error: "HOST_IS_REQUIRED",
      invalid_type_error: "HOST_IS_REQUIRED",
    })
    .url({ message: "HOST_IS_INVALID" }),
});
export const imageUrlsSchema = z.array(imageUrlSchema);

export const galleryFromSchema = z.object({
  galleries: galleriesCountSchema.min(1, { message: "GALLERY_IS_REQUIRED" }),
  imageUrls: imageUrlsSchema.min(1, { message: "IMAGE_IS_REQUIRED" }),
});

export type ImageUrlType = z.infer<typeof imageUrlSchema>;
export type GalleryFromType = z.infer<typeof galleryFromSchema>;
