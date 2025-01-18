"use client";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Lang } from "@/lib/use-translation/types";
import { AuthMagicLink } from "./authMagicLink";
import { AuthButton } from "./authButton";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";

export function AuthForm({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "authForm");

  return (
    <div className="bg-card shadow-input mx-auto p-4 md:p-8 rounded-none md:rounded-2xl w-full max-w-md">
      <h2 className="font-bold text-card-foreground text-xl">
        {t("welcome-to-website")}
      </h2>
      <p className="mt-2 max-w-sm text-card-foreground text-sm">
        {t("login-description")}
      </p>

      <AuthMagicLink locale={locale} />
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 w-full h-[1px]" />
      <div className="flex flex-col space-y-4">
        <AuthButton provider="github">
          <IconBrandGithub className="w-4 h-4 text-secondary-foreground" />

          <span className="text-sm"> {t("github")} </span>
        </AuthButton>

        <AuthButton provider="google">
          <IconBrandGoogle className="w-4 h-4 text-secondary-foreground" />
          <span className="text-sm"> {t("google")} </span>
        </AuthButton>
      </div>
    </div>
  );
}
