"use client";
import { LocaleParamsType } from "../../types";
import Image from "next/image";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Footer } from "@/app/components/footer";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  contactFormType,
  ContactSubjectArray,
} from "./types";
import { Textarea } from "@/components/ui/textarea";
import { contactSubject } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { MessageCreate } from "@/server/message.action";
import { useConfirmation } from "@/app/components/DialogConfirm/hooks/useConfirmation";

export default function Home({ params }: LocaleParamsType) {
  const t = useServerTranslation(params.locale, "contact-us");

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const [subjectUrl, setSubjectUrl] = useQueryState(
    "subject",
    parseAsStringEnum<contactSubject>(
      Object.values(contactSubject)
    ).withDefault(contactSubject.CONTACT_US)
  );

  const defaultValues: contactFormType = {
    subject: subjectUrl,
    body: "",
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
  } = useForm<contactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: defaultValues,
  });
  const { subject, body } = useWatch({ control });

  const onSubmitForm: SubmitHandler<contactFormType> = async (data) => {
    try {
      const isConfirm = await confirm();
      if (!isConfirm) return;
      await MessageCreate({
        subject: data.subject,
        body: data.body,
      });
      reset();
      await successDialog();
    } catch (e) {
      await errorDialog();

      console.error(e);
    }
  };
  return (
    <main className="relative flex flex-col justify-between items-center w-full h-full min-h-screen overflow-hidden">
      <Image
        src={"/pictures/contact-form/black-bg-fom.webp"}
        blurDataURL={"/pictures/contact-form/tumblr_black-bg-fom.webp"}
        placeholder="blur"
        alt={"couple holding hands at a wedding"}
        fill
        className="dark:block z-0 dark:absolute blur-sm object-cover"
      />
      <Image
        src={"/pictures/contact-form/white-bg-fom.webp"}
        blurDataURL={"/pictures/contact-form/tumblr_white-bg-fom.webp"}
        placeholder="blur"
        alt={"couple holding hands at a wedding"}
        fill
        className="light:block z-0 light:absolute dark:hidden object-cover"
      />

      <section className="z-10 flex flex-col justify-center items-center w-full">
        <h1 className="mx-auto my-4 max-w-screen-sm font-light text-4xl text-center lg:text-6xl">
          {t("title")}{" "}
        </h1>
        <p className="my-8 max-w-screen-sm text-center text-lg">
          {" "}
          {t("description")}
        </p>
      </section>
      <section className="z-10 flex-1 w-full max-w-screen-sm">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col bg-card shadow-input p-12 rounded-sm"
        >
          <Select
            onValueChange={(e) => {
              setSubjectUrl(e as contactSubject);
              setValue("subject", e);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t(subject as string)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ContactSubjectArray.map((ContactSubject, idx) => (
                  <SelectItem key={idx} value={ContactSubject}>
                    {" "}
                    {t(ContactSubject)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Textarea
            placeholder={t("body")}
            className="my-4 min-h-48"
            {...register("body")}
          />

          <Button
            disabled={!subject || (body ?? "").length < 10 || isSubmitting}
            size={"lg"}
            type="submit"
            className="mx-auto"
          >
            {t("submit")}
          </Button>
        </form>
      </section>

      <Footer
        className="z-10 bg-background my-0 p-2 w-full h-36"
        locale={params.locale}
      />
    </main>
  );
}
