import { redirect } from "next/navigation";
import { RootChildrenType } from "../../types";
import { $Enums } from "@prisma/client";
import { auth } from "@/auth";

export default async function RootLayout({
  children,
  params,
}: RootChildrenType) {
  const session = await auth();

  if (
    !((session?.user as any).role as $Enums.role[]).includes($Enums.role.ADMIN)
  ) {
    redirect(`/${params.locale}/dashboard`);
  } else {
    return children;
  }
}
