import { RootPaginationChildrenType } from "@/app/[locale]/reviews/[page]/types";
import { auth } from "@/auth";
import { $Enums } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
  params,
}: RootPaginationChildrenType) {
  const session = await auth();

  if (
    !((session?.user as any).role as $Enums.role[]).includes($Enums.role.ADMIN)
  ) {
    redirect(`/${params.locale}/dashboard`);
  } else {
    return children;
  }
}
