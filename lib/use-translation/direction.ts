import { Lang, DirectionEnum } from './types';

export function languageDirection(language: Lang): DirectionEnum {
  const rtlLanguages = [Lang.AR];
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
}

export const detectTextDirection = (text: string): DirectionEnum => {
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF]/;

  if (rtlRegex.test(text)) {
    return 'rtl';
  } else {
    return 'ltr';
  }
};
