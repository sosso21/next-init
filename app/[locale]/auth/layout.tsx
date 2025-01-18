import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RootChildrenType } from "../types";

export default async function RootLayout({
  children,
  params,
}: RootChildrenType) {
  const session = await auth();

  if (session) {
    redirect(`/${params.locale}/dashboard`);
  }

  return children;
}
