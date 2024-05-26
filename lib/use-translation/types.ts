export enum Lang {
  AR = "ar",
  EN = "en",
  FR = "fr",
  ES = "es",
}

export type messagesLang = {
  [key: string]: string | messagesLang;
};
