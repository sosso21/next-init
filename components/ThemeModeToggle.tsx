"use client";
import * as React from "react";
import { Laptop, Moon, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useClientTranslation } from "@/lib/use-translation/use-client-translation";

export const ThemeModeToggle = ({
  className,
  size,
  variant,
  showText,
}: {
  size?: "sm" | "lg";
  className?: string;
  variant?:
    | "default"
    | "outline"
    | "link"
    | "destructive"
    | "secondary"
    | "ghost";
  showText?: boolean;
}) => {
  const t = useClientTranslation("SettingMenuDialog");

  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={className ?? ""}
          variant={variant ?? "default"}
          size={size ?? "sm"}
        >
          <Sun className="inline dark:hidden" />
          <Moon className="dark:inline hidden" />

          {showText ? (
            <span className="mobile:inline md:hidden mx-2">
              {" "}
              {t("toggle-theme")}
            </span>
          ) : (
            <></>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-[100]" align="center">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mx-4" /> {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mx-4" /> {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mx-4" /> {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
