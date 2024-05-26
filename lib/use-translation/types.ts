import { z } from 'zod';

const directionEnumSchema = z.enum(['ltr', 'rtl']);
export type DirectionEnum = z.infer<typeof directionEnumSchema>;

export enum Lang {
  AR = 'ar',
  EN = 'en',
  FR = 'fr',
  ES = 'es',
}

export type messagesLang = {
  [key: string]: string | messagesLang;
};
