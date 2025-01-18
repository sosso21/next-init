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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import {
  AddPhoneFormSchema,
  AddPhoneFormType,
  EUROPE_NORTH_AMERICA_CODES,
} from "../[locale]/dashboard/types";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneNumberAdd, PhoneNumberDelete } from "@/server/user.action";
import { Trash2 } from "lucide-react";

export interface PhonesType {
  number: string;
  code: string;
}

interface PhoneManagementProps {
  phones: PhonesType[];
}

export const PhoneDialog = ({
  defaultShow = false,
  showOpenButton = false,
}: {
  defaultShow?: boolean;
  showOpenButton?: boolean;
}) => {
  const t = useClientTranslation("phoneManagement");

  const [isDialogOpen, setIsDialogOpen] = useState(defaultShow);

  const defaultValues: AddPhoneFormType = {
    number: "",
    code: "+33",
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
  } = useForm<AddPhoneFormType>({
    resolver: zodResolver(AddPhoneFormSchema),
    defaultValues: defaultValues,
  });
  const { code } = useWatch({ control });
  const onSubmitForm: SubmitHandler<AddPhoneFormType> = async (data) => {
    //
    try {
      await PhoneNumberAdd(data);
      window.location.reload();
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
          <Button variant="outline" className="mt-2">
            {t("add-phone")}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add-new-phone-number")}</DialogTitle>
          <DialogDescription>{t("dialog-description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="gap-4 grid py-4">
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="code" className="text-right">
                {t("country-code")}
              </Label>
              <Select
                value={code}
                onValueChange={(value) => setValue("code", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t("select-country-code")} />
                </SelectTrigger>
                <SelectContent>
                  {EUROPE_NORTH_AMERICA_CODES.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.code} ({item.label})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="items-center gap-4 grid grid-cols-4">
              <Label htmlFor="phoneNumber" className="text-right">
                {t("phone-number")}
              </Label>
              <Input
                id="phoneNumber"
                {...register("number")}
                onChange={(event) =>
                  setValue(
                    "number",
                    (event.target.value ?? "")
                      .replace(/[^0-9]/g, "")
                      .replace(/^0+/, "")
                      .slice(0, 9)
                  )
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button>{t("add-phone")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export function PhoneManagement({ phones }: PhoneManagementProps) {
  const t = useClientTranslation("phoneManagement");
  const handleDeletePhone = async (phone: AddPhoneFormType) => {
    await PhoneNumberDelete(phone);

    window.location.reload();
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {phones.map((phone, index) => (
          <div
            key={index}
            className="flex items-center gap-4 space-x-2 p-2 rounded-md"
          >
            <span className="w-full text-sm">{`${
              phone.code
            } ${phone.number.replace(
              /(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/,
              "$1 $2 $3 $4 $5"
            )}`}</span>
            <Button
              variant="outline"
              className="flex gap-4"
              size="sm"
              onClick={() => handleDeletePhone(phone)}
            >
              <Trash2 size={"1rem"} />
              <span>{t("delete")}</span>
            </Button>
          </div>
        ))}
      </div>
      <PhoneDialog showOpenButton={true} />
    </div>
  );
}
