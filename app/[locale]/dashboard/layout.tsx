import { redirect } from "next/navigation";
import { RootChildrenType } from "../types";
import { auth } from "@/auth";
import { PhoneDialog } from "@/app/components/PhoneManagement";
import { createId } from "@paralleldrive/cuid2";
import { prisma } from "@/lib/prisma";
import { stringToSlug } from "@/lib/stingToSlug";

export default async function RootLayout({
  children,
  params,
}: RootChildrenType) {
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect(`/${params.locale}/auth`);
  } else if (
    !(session?.user as any)?.username ||
    !(session?.user as any)?.name
  ) {
    const randomUsername =
      session?.user?.email?.split("@")[0] ?? `user-${createId()}`;
    const name = session?.user?.name ?? randomUsername;

    const username: string = ((session?.user as any)?.username ?? "").length
      ? (session?.user as any)?.username
      : randomUsername;

    await prisma.user.update({
      where: {
        id: session?.user.id,
      },
      data: {
        username: stringToSlug(username),
        name: name,
      },
    });
  } else if ((session?.user as any)?.phones.length === 0) {
    return (
      <main>
        <PhoneDialog defaultShow />
      </main>
    );
  }

  return children;
}
