import { stringToSlug } from "@/lib/stingToSlug";
import { z } from "zod";

export const EUROPE_NORTH_AMERICA_CODES = [
  { label: "US", code: "+1" },
  { label: "FR", code: "+33" },
  { label: "UK", code: "+44" },
  { label: "DE", code: "+49" },
  { label: "IT", code: "+39" },
  { label: "ES", code: "+34" },
  { label: "NO", code: "+47" },
  { label: "SE", code: "+46" },
  { label: "DK", code: "+45" },
  { label: "PL", code: "+48" },
  { label: "BE", code: "+32" },
  { label: "CH", code: "+41" },
] as const;

// Extracting the codes as a tuple
const COUNTRY_CODES = EUROPE_NORTH_AMERICA_CODES.map(({ code }) => code) as [
  string,
  ...string[]
];

export const usernameUpdateFormSchema = z.object({
  username: z.preprocess(
    (value) => stringToSlug(`${value}`),
    z.string().min(3, "USERNAME_IS_TOO_SHORT")
  ),
});

export const AddPhoneFormSchema = z.object({
  number: z.preprocess(
    (value) =>
      `${value}`
        .replace(/[^0-9]/g, "")
        .replace(/^0+/, "")
        .slice(0, 9),
    z.string().length(9, {
      message: "The phone number must be exactly 9 numeric characters.",
    })
  ),
  code: z.enum(COUNTRY_CODES),
});

export type usernameUpdateFormType = z.infer<typeof usernameUpdateFormSchema>;
export type AddPhoneFormType = z.infer<typeof AddPhoneFormSchema>;
