import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "@/lib/use-translation/languages-data";
import { cookies } from "next/headers";

acceptLanguage.languages(languages);

export const config = {
  matcher: "/:location*",
};

export const cookieName = "i18next";

export function middleware(req: any) {
  let lng;

  if (req.cookies.has(cookieName)) {
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  }

  if (!lng) {
    const acceptLangHeader = req.headers.get("Accept-Language");
    if (acceptLangHeader) {
      lng = acceptLangHeader.split("-")[0];
    }
  }

  if (!lng) lng = fallbackLng;

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${lng}`, req.url));
  }

  const localeMatch = req.nextUrl.pathname.match(/^\/\[(locale)\](.*)/);

  if (localeMatch) {
    const actualLocale = languages.includes(lng) ? lng : fallbackLng;
    const newUrl = req.nextUrl.pathname.replace("[locale]", actualLocale);
    return NextResponse.redirect(new URL(newUrl, req.url));
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) =>
      refererUrl.pathname.startsWith(`/${l}`)
    );
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
