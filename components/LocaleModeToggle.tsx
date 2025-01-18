"use client";
import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, usePathname } from "next/navigation";
import { Lang } from "@/lib/use-translation/types";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";

import Link from "next/link";
import { Button, ButtonProps, buttonVariants } from "./ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export const LocaleModeToggle = ({
  className,
  size,
  variant = "default",
  showText = false,
}: {
  size?: ButtonProps["size"];
  className?: string;
  variant?: ButtonProps["variant"];
  showText?: boolean;
}) => {
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
        <Button
          size={size ?? "lg"}
          variant={variant ?? "outline"}
          className={className}
        >
          <Languages size="16" />
          <span className={cn({ hidden: !showText }, "mx-2")}>
            {t("language")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100]" align="center">
        {Object.values(Lang).map((locale: Lang) => (
          <Link aria-label={t(locale)} key={locale} href={changeLocale(locale)}>
            <DropdownMenuItem
              className={cn(buttonVariants({ variant }), "flex")}
            >
              {t(locale)}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
