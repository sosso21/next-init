// ... (unchanged code above)

import { Lang } from "../use-translation/types";

const t = {
  fr: {
    seconde: "il y a quelques secondes",
    minute: "il y a 1 minute",
    minutes: "il y a {count} minutes",
    hour: "il y a 1 heure",
    hours: "il y a {count} heures",
    day: "il y a 1 jour",
    days: "il y a {count} jours",
    month: "il y a 1 mois",
    months: "il y a {count} mois",
    year: "il y a 1 an",
    years: "il y a {count} ans",
  },
  en: {
    seconde: "a few seconds ago",
    minute: "1 minute ago",
    minutes: "{count} minutes ago",
    hour: "1 hour ago",
    hours: "{count} hours ago",
    day: "1 day ago",
    days: "{count} days ago",
    month: "1 month ago",
    months: "{count} months ago",
    year: "1 year ago",
    years: "{count} years ago",
  },
  es: {
    seconde: "hace unos segundos",
    minute: "hace 1 minuto",
    minutes: "hace {count} minutos",
    hour: "hace 1 hora",
    hours: "hace {count} horas",
    day: "hace 1 día",
    days: "hace {count} días",
    month: "hace 1 mes",
    months: "hace {count} meses",
    year: "hace 1 año",
    years: "hace {count} años",
  },
  ar: {
    seconde: "قبل بضع ثوانٍ",
    minute: "قبل دقيقة واحدة",
    minutes: "قبل {count} دقائق",
    hour: "قبل ساعة واحدة",
    hours: "قبل {count} ساعات",
    day: "قبل يوم واحد",
    days: "قبل {count} أيام",
    month: "قبل 1 شهر",
    months: "قبل {count} أشهر",
    year: "قبل سنة واحدة",
    years: "قبل {count} سنوات",
  },
};

// ... (unchanged code below)

export function formatElapsedTime({
  date,
  locale = process.env.DEFAULT_LANG as Lang,
}: {
  date: Date;
  locale: Lang;
}): string {
  const translation = t[locale];

  const currentDate = new Date();
  const oldDate = new Date(date);
  const difference = currentDate.getTime() - oldDate.getTime();
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 1) {
    return translation.years.replace("{count}", years.toString());
  } else if (years === 1) {
    return translation.year;
  } else if (months > 1) {
    return translation.months.replace("{count}", months.toString());
  } else if (months === 1) {
    return translation.month;
  } else if (days > 1) {
    return translation.days.replace("{count}", days.toString());
  } else if (days === 1) {
    return translation.day;
  } else if (hours > 1) {
    return translation.hours.replace("{count}", hours.toString());
  } else if (hours === 1) {
    return translation.hour;
  } else if (minutes > 1) {
    return translation.minutes.replace("{count}", minutes.toString());
  } else if (minutes === 1) {
    return translation.minute;
  } else {
    return translation.seconde;
  }
}


export function formatDate(
  createdAt: string | Date,
  locale: Lang =  Lang.FR,
  includeTime: boolean = false
): string {
  const date = new Date(createdAt);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided.");
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
}