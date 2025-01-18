import { Lang, messagesLang } from "./types";

import { t, getMessage } from "./languages-data";

export const useServerTranslation = (
  locale: Lang,
  section?: string
): ((underSection: string) => string) => {
  const key = !section ? "" : `${section}.`;

  const message = getMessage(locale);

  return (underSection: string): string =>
    t(message as messagesLang, `${key}${underSection}`.split(" ").join(""));
};
