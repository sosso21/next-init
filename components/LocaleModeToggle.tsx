"use client";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, usePathname } from "next/navigation";
import { Lang } from "@/lib/interfaces/types";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";

import Link from "next/link";
import { Button } from "./ui/button";
import { Languages } from "lucide-react";

export const LocaleModeToggle = () => {
  const t = useClientTranslation("header");
  const params = useParams();
  const pathname = usePathname();

  const changeLocale = (locale: Lang) => {
    return pathname.replace(
      `/${(params as any)?.locale ?? process.env.DEFAULT_LANGUAGE}`,
      `/${locale}`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="w-full" variant="outline" size="lg">
          <Languages />

          <span className="sr-only"> {t("light")} </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(Lang).map((locale: Lang) => (
          <Link key={locale} href={changeLocale(locale)}>
            <DropdownMenuItem>{t(locale)}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
