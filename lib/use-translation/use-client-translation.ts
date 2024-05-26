"use client";
import { useParams } from "next/navigation";
import { fallbackLng, getMessage, t } from "./languages-data";
import { Lang, messagesLang } from "./types";

export const useClientLocation = (): Lang => {
  const params = useParams();

  return (params.locale || fallbackLng) as Lang;
};

export const useClientTranslation = (
  section?: string
): ((underSection: string) => string) => {
  const key = !section ? "" : `${section}.`;
  const locale = useClientLocation();
  const message = getMessage(locale);

  return (underSection: string): string =>
    t(message as messagesLang, `${key}${underSection}`.split(" ").join(""));
};
