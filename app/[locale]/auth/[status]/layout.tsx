import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { LocaleAuthStatusRootChildrenType, statusEnumArray } from "./types";

export async function generateStaticParams() {
  return statusEnumArray.map((status) => ({
    status,
  }));
}

export default async function RootLayout({
  children,
  params,
}: LocaleAuthStatusRootChildrenType) {
  const session = await auth();

  if (session) {
    redirect(`/${params.locale}/dashboard`);
  } else if (!statusEnumArray.includes(params.status)) {
    redirect(`/${params.locale}/auth`);
  }

  return children;
}
