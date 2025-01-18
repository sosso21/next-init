"use client";
import { LocaleParamsType } from "../../types";
import Image from "next/image";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Footer } from "@/app/components/footer";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { reviewFormSchema, ReviewFormType } from "./types";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { createReview } from "@/server/review.action";
import { useConfirmation } from "@/app/components/DialogConfirm/hooks/useConfirmation";

export default function Home({ params }: LocaleParamsType) {
  const t = useServerTranslation(params.locale, "create-review");

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const defaultValues: ReviewFormType = {
    title: "",
    body: "",
    serviceQuality: 5,
    responseTime: 5,
    professionalism: 5,
    valueForMoney: 5,
    flexibility: 5,
  };
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    // setError,
    getValues,
    // watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ReviewFormType>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: defaultValues,
  });
  const { title, body } = useWatch({ control });

  const onSubmitForm: SubmitHandler<ReviewFormType> = async (data) => {
    try {
      const isConfirm = await confirm();
      if (!isConfirm) return;
      await createReview(data);

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
          className="flex flex-col gap-2 bg-card shadow-input p-12 rounded-sm"
        >
          <Input
            type="text"
            placeholder={t("title-input")}
            {...register("title")}
          />
          <Textarea
            placeholder={t("body")}
            className="my-4 min-h-48"
            {...register("body")}
          />

          <div className="flex flex-col gap-2">
            {[
              "serviceQuality",
              "responseTime",
              "professionalism",
              "valueForMoney",
              "flexibility",
            ].map((key) => (
              <div
                className="flex flex-wrap justify-between items-center"
                key={key}
              >
                <p className="basis-full"> {t(`${key}`)}</p>
                <span className="flex items-center gap-x-4 basis-full">
                  <Slider
                    max={5}
                    min={0}
                    value={[getValues(key as keyof ReviewFormType) as number]}
                    onValueChange={(value) =>
                      setValue(
                        key as keyof ReviewFormType,
                        !!value[0] ? value[0] : 1
                      )
                    }
                    step={1}
                    className="flex-1"
                  />
                  <i> {getValues(key as keyof ReviewFormType)} </i>
                </span>
              </div>
            ))}
          </div>

          <Button
            disabled={!title || (body ?? "").length < 10 || isSubmitting}
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
