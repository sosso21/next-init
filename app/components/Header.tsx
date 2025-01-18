import { LocaleModeToggle } from "@/components/LocaleModeToggle";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";

import Link from "next/link";
import { DKPhotographLightIcon } from "./icons/Icons";
import { UserPlusIcon } from "lucide-react";
import { auth } from "@/auth";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "header");

  return (
    <header className="flex justify-between items-center md:hidden bg-sidebar-background mx-auto px-4 lg:px-6 py-2.5 w-full text-sidebar-foreground">
      <Link aria-label={t("title")} href={`/${locale}`}>
        <DKPhotographLightIcon />
      </Link>

      <ul className="flex justify-end items-center gap-4">
        <li>
          <ThemeModeToggle size="icon" variant="ghost" className="w-7 h-7" />
        </li>
        <li>
          <LocaleModeToggle size="icon" variant="ghost" className="w-7 h-7" />
        </li>
        <li>
          <SidebarTrigger />
        </li>
      </ul>
    </header>
  );
};

export const UserProfileOrAuth = async ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "header");
  const session = await auth();

  return session
    ? {
        auth: session?.user,
        title: session?.user?.name ?? "",
        url: `/${locale}/dashboard`,
        icon: (
          <>
            <div className="absolute opacity-0 hover:opacity-100 animate-ping">
              <div className="relative flex justify-center items-center w-[48px] h-[48px]">
                <div className="absolute bg-transparent shadow-lg shadow-primary rounded-full w-[110%] h-[110%]"></div>
                <div className="absolute bg-transparent shadow-lg shadow-secondary rounded-full w-[108%] h-[108%] rotate-90"></div>
                <div className="absolute bg-transparent shadow-accent shadow-lg rounded-full w-[106%] h-[106%] rotate-180"></div>
              </div>
            </div>
            <Image
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? ""}
              width={"32"}
              height={"32"}
              className="border-primary hover:border-md hover:border-4 hover:shadow-lg border border-none rounded-full transition-all duration-300 ease-in-out object-cover"
            />
          </>
        ),
      }
    : {
        auth: null,
        title: t("auth"),
        url: `/${locale}/auth`,
        icon: <UserPlusIcon />,
      };
};
