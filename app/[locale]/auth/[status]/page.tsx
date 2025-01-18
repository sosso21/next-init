"use client";

import { LocaleAuthStatusParamsType } from "./types";
import { MailCheck, X } from "lucide-react";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { DialogConfirmColorEnum } from "@/app/components/DialogConfirm/store/useConfirmationStore";
import { useConfirmation } from "@/app/components/DialogConfirm/hooks/useConfirmation";
import { redirect } from "next/navigation";
import Image from "next/image";

export default function Home({ params }: LocaleAuthStatusParamsType) {
  const t = useClientTranslation("auth-dialog-message");

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const messageDialogParams = {
    error: {
      title: t("AUTH_ERROR_MESSAGE_TITLE"),
      description: t("AUTH_ERROR_DESCRIPTION"),
      color: DialogConfirmColorEnum.DANGER,
      icon: X,
    },
    success: {
      title: t("AUTH_SUCCESS_MESSAGE_TITLE"),
      description: t("AUTH_SUCCESS_DESCRIPTION"),
      color: DialogConfirmColorEnum.SUCCESS,
      icon: MailCheck,
    },
  };

  const showDialog = async () => {
    await successDialog({
      ...messageDialogParams[params.status],
    });
  };

  return (
    <main className="bg-[url('/pictures/auth/tumblr_dark_camera.webp')] dark:bg-[url('/pictures/auth/tumblr_light_camera.webp')] bg-cover bg-no-repeat w-full h-screen">
      <section
        className="flex justify-center items-center bg-[url('/pictures/auth/dark_camera.webp')] dark:bg-[url('/pictures/auth/light_camera.webp')] bg-cover bg-no-repeat py-24 w-full min-h-full"
        onClick={() => redirect(`/${params.locale}/auth`)}
      >
        <Image
          src={"/pictures/auth/tumblr_light_camera.webp"}
          alt="camera"
          width={0.5}
          height={0.5}
          onLoad={async () => await showDialog()}
        />
      </section>
    </main>
  );
}
