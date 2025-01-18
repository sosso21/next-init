"use client";
import { BottomGradient } from "@/components/BottomGradient";

import { LabelInputContainer } from "@/components/LabelInputContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { signInWithMagicLink } from "@/server/action";
import { WandIcon } from "lucide-react";

import { useState } from "react";

export function AuthMagicLink({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "authForm");
  const [emil, setEmil] = useState<string | undefined>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emil) {
      return;
    }
    const formData = new FormData();
    formData.append("email", emil as string);
    await signInWithMagicLink(formData);
    setEmil("");
  };

  return (
    <form className="my-4" onSubmit={handleSubmit}>
      <LabelInputContainer className="mb-4">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          placeholder="username@exemple.com"
          type="email"
          required
          value={emil}
          onChange={(e) => setEmil(e.target.value)}
        />
      </LabelInputContainer>

      <Button
        className="block relative from-black dark:from-zinc-900 to-neutral-600 dark:to-zinc-900 shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] rounded-md w-full h-10 font-medium text-white group/btn"
        type="submit"
      >
        <WandIcon className="inline mx-4" />
        {t("send-magic-link")} &rarr;
        <BottomGradient />
      </Button>
    </form>
  );
}
