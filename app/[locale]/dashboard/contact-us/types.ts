import { contactSubject } from "@prisma/client";
import { z } from "zod";

export const ContactSubjectArray: string[] = Object.values(contactSubject);

export const ContactSubjectSchema = z.enum(
  ContactSubjectArray as [string, ...string[]]
);
export type ContactSubjectType = z.infer<typeof ContactSubjectSchema>;

export const contactFormSchema = z.object({
  subject: ContactSubjectSchema,
  body: z
    .string({ required_error: "MESSAGE_IS_REQUIRED" })
    .min(10, "MESSAGE_IS_TOO_SHORT"),
});
export type contactFormType = z.infer<typeof contactFormSchema>;
