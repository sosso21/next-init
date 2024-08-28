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
      <div className="flex justify-between items-center mx-auto max-w-screen-2xl">
        <Link aria-label={t("title")} href={`/${locale}`}>
          Init
        </Link>

        <div
          className="flex justify-end items-center lg:order-1 w-full lg:w-auto"
          id="mobile-menu-2"
        >
          <ul className="md:flex flex-row justify-end lg:space-x-8 hidden mt-4 lg:mt-0 font-medium">
            <li>
              <ThemeModeToggle size="lg" className="w-full" variant="outline" />
            </li>
            <li>
              <LocaleModeToggle />
            </li>
            <li>
              <Link aria-label={t("login")} href={`${locale}/auth`}>
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
