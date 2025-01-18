import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RootChildrenType } from "../types";

export default async function RootLayout({
  children,
  params,
}: RootChildrenType) {
  const locale = (await params).locale;
  const session = await auth();

  if (session) {
    redirect(`/${locale}/dashboard`);
  }

  return children;
}
