"use client";
import * as React from "react";
import { Laptop, Moon, MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { cn } from "@/lib/utils";

export const ThemeModeToggle = ({
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
          <Sun size="16" className="inline dark:hidden" />
          <Moon size="16" className="dark:inline hidden" />

          {showText ? <span className="mx-2">{t("toggle-theme")}</span> : <></>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="z-20" align="center">
        <DropdownMenuItem
          className={cn(buttonVariants({ variant }), "flex")}
          onClick={() => setTheme("light")}
        >
          <Sun className="mx-4" /> {t("light")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(buttonVariants({ variant }), "flex")}
          onClick={() => setTheme("dark")}
        >
          <Moon className="mx-4" /> {t("dark")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={cn(buttonVariants({ variant }), "flex")}
          onClick={() => setTheme("system")}
        >
          <Laptop className="mx-4" /> {t("system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
