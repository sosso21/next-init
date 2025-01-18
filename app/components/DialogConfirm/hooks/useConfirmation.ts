import {
  DialogConfirmColorEnum,
  useConfirmationStore,
} from "../store/useConfirmationStore";
import { CheckCheck, LucideIcon, X } from "lucide-react";

interface ConfirmationOptions {
  icon?: LucideIcon;
  isSuccessDialog?: boolean;
  isErrorDialog?: boolean;
  title?: string;
  description?: string;
  color?: DialogConfirmColorEnum;
  isInfoDialog?: boolean;
}

export function useConfirmation() {
  const openConfirmation = useConfirmationStore(
    (state) => state.openConfirmation
  );

  const confirm = (options: ConfirmationOptions = {}): Promise<boolean> => {
    return new Promise((resolve) => {
      openConfirmation({
        ...options,
        onConfirm: () => {
          resolve(true);
        },
        onCancel: () => {
          resolve(false);
        },
      });
    });
  };

  return {
    confirm,
    success: (options: ConfirmationOptions = {}) =>
      confirm({
        color: DialogConfirmColorEnum.SUCCESS,
        icon: CheckCheck,
        isInfoDialog: true,
        isSuccessDialog: true,
        ...options,
      }),
    error: (options: ConfirmationOptions = {}) =>
      confirm({
        color: DialogConfirmColorEnum.DANGER,
        icon: X,
        isInfoDialog: true,
        isErrorDialog: true,
        ...options,
      }),
  };
}
