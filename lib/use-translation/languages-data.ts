import ar from "@/messages/ar.json";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import fr from "@/messages/fr.json";
import { Lang, messagesLang } from "./types";

export const fallbackLng = (process.env.DEFAULT_LANG as Lang) ?? Lang.EN;
export const languages = ["ar", "bn", "en", "kurd", "ru", "ur"];

export const getMessage = (local: Lang = fallbackLng): messagesLang => {
  let messageLanguage;
  if (!(languages as Lang[]).includes(local)) {
    local = fallbackLng;
  }
  switch (local) {
    case "ar":
      messageLanguage = ar;
      break;
    case "en":
      messageLanguage = en;
      break;
    case "es":
      messageLanguage = es;
      break;
    case "fr":
      messageLanguage = fr;
      break;
    default:
      messageLanguage = process.env.DEFAULT_LANGUAGE ?? "en";
      break;
  }
  return messageLanguage as messagesLang;
};

export const t = (message: messagesLang, key: string): string => {
  try {
    const keys = key.split(".");
    let value: string | messagesLang = message;
    for (const k of keys) {
      value = (value as messagesLang)[k];
    }
    return typeof value === "string" ? value : key;
  } catch {
    return key;
  }
};
