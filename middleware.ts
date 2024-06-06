import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "@/lib/use-translation/languages-data";
// export { auth as middleware } from "@/auth";

acceptLanguage.languages(languages);

export const config = {
  matcher: "/:location*",
};

const cookieName = "i18next";

export function middleware(req: any) {
  let lng;
  if (req.cookies.has(cookieName))
    lng = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lng) lng = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lng) lng = fallbackLng;

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(`/${lng}`, req.url));
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
