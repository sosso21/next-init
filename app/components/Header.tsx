import { LocaleModeToggle } from "@/components/LocaleModeToggle";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { UserPlusIcon } from "lucide-react";
import Link from "next/link";

export const Header = async ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "header");
  return (
    <header>
      <nav className="border-gray-200 bg-white dark:bg-gray-800 px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href={`/${locale}`}>
            <h1> {t("title")} </h1>
          </Link>

          <div
            className="lg:flex justify-between items-center lg:order-1 hidden w-full lg:w-auto"
            id="mobile-menu-2"
          >
            <ul className="flex lg:flex-row flex-col lg:space-x-8 mt-4 lg:mt-0 font-medium">
              <li>
                <ThemeModeToggle />
              </li>
              <li>
                <LocaleModeToggle />
              </li>
              <li>
                <Link href={`${locale}/login`}>
                  <Button>
                
                    <UserPlusIcon className="inline-block mx-4" /> {t("login")}
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};
