import { create } from "zustand";
import { LucideIcon, ShieldQuestion } from "lucide-react";

export enum DialogConfirmColorEnum {
  NULL = "",
  FOREGROUND = "text-foreground border-foreground",
  PRIMARY = "text-primary border-primary",
  SECONDARY = "text-secondary border-secondary",
  ACCENT = "text-accent border-accent",
  DANGER = "text-destructive border-destructive",
  SUCCESS = "text-muted border-muted",
}
interface ConfirmationState {
  isOpen: boolean;
  icon: LucideIcon;
  title?: string | null;
  description?: string | null;
  color?: DialogConfirmColorEnum;
  isInfoDialog?: boolean;
  isSuccessDialog?: boolean;
  isErrorDialog?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  openConfirmation: (
    options: Partial<
      Omit<
        ConfirmationState,
        "isOpen" | "openConfirmation" | "closeConfirmation"
      >
    >
  ) => void;
  closeConfirmation: () => void;
}

const defaultState = {
  isOpen: false,
  icon: ShieldQuestion,
  title: null,
  description: null,
  color: DialogConfirmColorEnum.NULL,
  isInfoDialog: false,
  isSuccessDialog: false,
  isErrorDialog: false,
};

export const useConfirmationStore = create<ConfirmationState>((set) => ({
  ...defaultState,
  onConfirm: () => {},
  onCancel: () => {},
  openConfirmation: (options) => {
    set((state) => ({
      ...state,
      ...options,
      isOpen: true,
    }));
  },
  closeConfirmation: () => {
    set((state) => ({
      ...defaultState,
      isOpen: false,
    }));
  },
}));
