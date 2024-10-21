"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { CheckCheck, TriangleAlert } from "lucide-react";
import { SelectSeparator } from "@/components/ui/select";
 
export enum DialogMessageColorEnum {
  FOREGROUND = "text-foreground border-foreground bg-foreground",
  PRIMARY = "text-primary border-primary bg-primary",
  SECONDARY = "text-secondary border-secondary bg-secondary",
  ACCENT = "text-accent border-accent bg-accent",
  DANGER = "text-destructive border-destructive bg-destructive",
  SUCCESS = "text-muted border-muted bg-muted",
}

export function DialogMessage({
  Icon,
  title,
  description,
  open,
  onOpenChange,
  defaultOpen = true,
  color = DialogMessageColorEnum.DANGER,
  errors,
  submitButton,
  cancelButton,
}: {
  Icon?: any;
  title?: string;
  description?: string;
  open?: boolean;
  color?: DialogMessageColorEnum;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;

  errors?: {
    [key: string]: { type: string; message: string };
  };
}) {
  const t = useClientTranslation("dialog-message");

  let type: string | undefined, message: string | undefined;
  if (errors && Object.keys(errors).length > 0) {
    const [firstKey] = Object.keys(errors);
    ({ type, message } = errors[firstKey]);
  }

  const safeType = type ?? "";
  const safeMessage = message ?? "";

  const DialogIcon = Icon
    ? Icon
    : color == DialogMessageColorEnum.DANGER
    ? TriangleAlert
    : CheckCheck;

  return (
    <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn("sm:max-w-[425px] text-center z-50", color, {
          "pb-4": submitButton || cancelButton,
          "bg-background": true,
        })}
      >
        <DialogHeader>
          <DialogIcon size={96} className="mx-auto" />
        </DialogHeader>
        <DialogTitle>{(title || safeType) && t(title ?? safeType)}</DialogTitle>
        <DialogDescription className="text-inherit">
          {(description || safeMessage) && t(description ?? safeMessage)}
        </DialogDescription>

        {(submitButton || cancelButton) && (
          <>
            <SelectSeparator className={cn("my-4", color)} />
            <DialogFooter>
              {cancelButton && (
                <Button
                  variant={"outline"}
                  {...cancelButton}
                  onClick={(event) => {
                    onOpenChange?.(false);
                    cancelButton.onClick && cancelButton.onClick(event);
                  }}
                >
                  {t((cancelButton.children as string) ?? "cancel")}
                </Button>
              )}

              {submitButton && (
                <Button
                  {...submitButton}
                  onClick={(event) => {
                    onOpenChange?.(false);
                    submitButton.onClick && submitButton.onClick(event);
                  }}
                >
                  {t((submitButton.children as string) ?? "submit")}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export const StoreDialogMessage = () => {
  const { dialogValue, setDialog } = dialogStore((state) => state);

  return (
    <DialogMessage
      {...dialogValue}
      onOpenChange={(state) => setDialog({ ...dialogValue, open: state })}
    />
  );
};

// dialog state
export interface DialogStoreValue {
  Icon?: any;
  title: string;
  description?: string;
  open: boolean;
  color: DialogMessageColorEnum;
  onOpenChange?: (open: boolean) => void;
  submitButton?: ButtonProps;
  cancelButton?: ButtonProps;
}

export interface DialogState {
  dialogValue?: DialogStoreValue;
  setDialog: (dialog: Partial<DialogStoreValue>) => void;
}

export const dialogStore = create<DialogState>()((set) => ({
  dialogValue: {
    Icon: undefined,
    open: false,
    color: DialogMessageColorEnum.DANGER,
    title: "",
    description: "",
  },
  setDialog: (dialogValue) =>
    set((state: any) => ({
      dialogValue: { ...state.dialogValue, ...dialogValue },
    })),
}));
