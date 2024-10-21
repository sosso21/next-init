import { LocaleModeToggle } from "@/components/LocaleModeToggle";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";

import Link from "next/link";

import { UserPlusIcon } from "lucide-react";

export const Header = ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "header");

  return (
    <header className="border-gray-200 px-4 lg:px-6 py-2.5 bg-ring w-full">
      <div className="flex items-center justify-between mx-auto max-w-screen-2xl">
        <Link aria-label={t("title")} href={`/${locale}`}>
          Init
        </Link>

        <div
          className="flex items-center justify-end w-full lg:order-1 lg:w-auto"
          id="mobile-menu-2"
        >
          <ul className="flex-row justify-end hidden mt-4 font-medium md:flex lg:space-x-8 lg:mt-0">
            <li>
              <ThemeModeToggle size="lg" className="w-full" variant="outline" />
            </li>
            <li>
              <LocaleModeToggle />
            </li>
            <li>
              <Link aria-label={t("auth")} href={`${locale}/auth`}>
                <Button>
                  <UserPlusIcon className="inline-block mx-4" /> {t("login")}
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
