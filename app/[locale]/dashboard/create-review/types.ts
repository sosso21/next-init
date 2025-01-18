import { z } from "zod";

export const reviewFormSchema = z.object({
  title: z
    .string({ required_error: "TITLE_IS_REQUIRED" })
    .min(1, "TITLE_IS_TOO_SHORT"),
  body: z
    .string({ required_error: "MESSAGE_IS_REQUIRED" })
    .min(10, "MESSAGE_IS_TOO_SHORT"),

  serviceQuality: z.number().min(1).max(5),
  responseTime: z.number().min(1).max(5),
  professionalism: z.number().min(1).max(5),
  valueForMoney: z.number().min(1).max(5),
  flexibility: z.number().min(1).max(5),
});
export type ReviewFormType = z.infer<typeof reviewFormSchema>;
