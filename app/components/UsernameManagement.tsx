"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import {
  usernameUpdateFormSchema,
  usernameUpdateFormType,
} from "../[locale]/dashboard/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { usernameUpdate } from "@/server/user.action";

interface UsernameManagementProps {
  username: string;
  defaultShowOpenButton?: boolean;
}

export const UsernameDialog = ({
  username = "",
  defaultShow = false,
  showOpenButton = false,
}: {
  username?: string;
  defaultShow?: boolean;
  showOpenButton?: boolean;
}) => {
  const t = useClientTranslation("usernameManagement");

  const [isDialogOpen, setIsDialogOpen] = useState(defaultShow);

  const defaultValues: usernameUpdateFormType = {
    username: username,
  };
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    // setError,
    // getValues,
    // watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<usernameUpdateFormType>({
    resolver: zodResolver(usernameUpdateFormSchema),
    defaultValues: defaultValues,
  });
  const onSubmitForm: SubmitHandler<usernameUpdateFormType> = async (data) => {
    //
    try {
      await usernameUpdate(data) .then (()=>  window.location.reload()  )
    } catch (e) {
      //
    }
  };
  return (
    <Dialog
      open={defaultShow ? defaultShow : isDialogOpen}
      onOpenChange={setIsDialogOpen}
    >
      {showOpenButton && (
        <DialogTrigger asChild>
          <Button variant="outline" size={"icon"} className="mt-2">
            <Pen size={"1rem"} />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add-new-username")}</DialogTitle>
          <DialogDescription>{t("dialog-description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="gap-4 grid py-4">
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="username" className="text-right">
                {t("username")}
              </Label>
              <Input
                id="username"
                {...register("username")}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button>{t("add-username")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function UsernameManagement({
  username,
  defaultShowOpenButton = true,
}: UsernameManagementProps) {
  const t = useClientTranslation("usernameManagement");
  return (
    <div className="flex items-center gap-2 space-y-2">
      <p>{`@${username}`}</p>
      <UsernameDialog
        showOpenButton={defaultShowOpenButton}
        username={username}
      />
    </div>
  );
}
