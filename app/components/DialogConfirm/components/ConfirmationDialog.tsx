"use client";

import { useConfirmationStore } from "../store/useConfirmationStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";

export function ConfirmationDialog() {
  const t = useClientTranslation("confirmation-dialog");
  const {
    isOpen,
    icon: Icon,
    title,
    description,
    color,
    isInfoDialog,
    isSuccessDialog,
    isErrorDialog,
    onConfirm,
    onCancel,
    closeConfirmation,
  } = useConfirmationStore();

  const dialogText = {
    title: t("title"),
    description: t("description"),
    confirm: t("confirm"),
    cancel: t("Cancel"),
    submit: t("ok"),
  };

  if (!!isSuccessDialog) {
    dialogText.title = t("success_title");
    dialogText.description = t("success_description");
  } else if (!!isErrorDialog) {
    dialogText.title = t("error_title");
    dialogText.description = t("error_description");
  }

  const handleConfirm = () => {
    onConfirm();
    closeConfirmation();
  };

  const handleCancel = () => {
    onCancel();
    closeConfirmation();
  };

  const closeConfirmationChange = (open: boolean) => {
    closeConfirmation();
    if (!open) {
      handleCancel();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeConfirmationChange}>
      <DialogContent
        className={cn("sm:max-w-[425px] text-center z-50 ", color, {
          border: !!color,
        })}
      >
        <DialogHeader>
          {Icon && <Icon size={96} className="mx-auto" />}
        </DialogHeader>

        <DialogTitle>{title ?? dialogText.title}</DialogTitle>
        <DialogDescription>
          {description ?? dialogText.description}
        </DialogDescription>

        <DialogFooter>
          {!isInfoDialog && (
            <Button variant="outline" onClick={handleCancel}>
              {dialogText.cancel}
            </Button>
          )}
          <Button onClick={handleConfirm}>
            {isInfoDialog ? dialogText.submit : dialogText.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
