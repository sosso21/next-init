"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/ui/milti-selector-input";
import { Switch } from "@/components/ui/switch";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { searchUsers } from "@/server/user.action";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  createOrUpdateGallerySchema,
  createOrUpdateGalleryType,
} from "../[locale]/dashboard/create-gallery/types";
import { SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { $Enums } from "@prisma/client";

import { ProfilePictureUploader } from "@/components/profile-picture-uploader";
import { PenLine, UserPlus2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ownerApp } from "@/constants";
import { stringToSlug } from "@/lib/stingToSlug";
import { getPicture } from "@/prisma/seed/data/reviews";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceArray } from "../[locale]/[service]/types";
import { Button } from "@/components/ui/button";
import {
  addUserToGallery,
  createOrUpdateGallery,
  getGalleryUsersIds,
  removeUserFromGallery,
} from "@/server/gallery.action";
import { createId } from "@paralleldrive/cuid2";
import { FileType, handleFileUpload } from "@/lib/images-uploader";
import { useConfirmation } from "./DialogConfirm/hooks/useConfirmation";

const defaultSlug = stringToSlug(ownerApp + "-" + createId());
const defaultValueForm: createOrUpdateGalleryType = {
  slug: defaultSlug,
  profilePicture: getPicture({ author: defaultSlug }),
  tumblrProfilePicture: null,
  private: true,
  category: $Enums.servicePage.DEFAULT as string,
};
export function GalleryEditor({
  defaultValue = defaultValueForm,
}: {
  defaultValue?: createOrUpdateGalleryType;
}) {
  const t = useClientTranslation("gallery-editor");
  const [file, setFile] = useState<FileType | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    // reset,
    // setError,
    // getValues,
    // watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<createOrUpdateGalleryType>({
    resolver: zodResolver(createOrUpdateGallerySchema),
    defaultValues: defaultValue,
  });

  const {
    confirm,
    success: successDialog,
    error: errorDialog,
  } = useConfirmation();

  const {
    id,
    slug,
    profilePicture,
    category,
    private: isPrivate,
  } = useWatch({ control });

  const onSubmitForm: SubmitHandler<createOrUpdateGalleryType> = async (
    data
  ) => {
    const isConfirm = await confirm();
    if (!isConfirm) return;

    try {
      if (file != null && file.uploaded === false) {
        const image = await handleFileUpload([file]);
        if (image.length > 0 && image[0].urls) {
          data.profilePicture = `${image[0].urls.host}/${image[0].urls.webp}`;
          data.tumblrProfilePicture = `${image[0].urls.host}/${image[0].urls.tumblr}`;

          setFile(null);
        }
      }
      const result = await createOrUpdateGallery(data)
        .then(async (response) => {
          await successDialog();
          return response[0] as createOrUpdateGalleryType;
        })
        .catch(async (e) => {
          await errorDialog();
          return {} as createOrUpdateGalleryType;
        });
      Object.keys(result).forEach((key) => {
        setValue(
          key as keyof createOrUpdateGalleryType,
          result[key as keyof createOrUpdateGalleryType]
        );
      });
    } catch (e) {}
  };

  return (
    <section>
      <Accordion
        type="single"
        defaultValue="item-1"
        collapsible
        className="mx-auto max-w-lg h-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex justify-start gap-2 w-full">
            <PenLine />
            <span className="w-full text-start">{t("general-settings")}</span>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4">
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="flex flex-col justify-center items-center gap-6 py-6"
            >
              <Input
                type="text"
                value={slug}
                onChange={(e) => setValue("slug", stringToSlug(e.target.value))}
                placeholder={t("gallery-name")}
              />

              <Select
                defaultValue={ServiceArray[0]}
                value={category}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("select-category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("select-category")} </SelectLabel>
                    {ServiceArray.map((service) => (
                      <SelectItem key={service} value={service as string}>
                        {t(service.toLowerCase())}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <section className="flex justify-start items-center gap-4 w-full">
                <Switch
                  id="isPrivate"
                  checked={isPrivate}
                  onCheckedChange={() => setValue("private", !isPrivate)}
                />
                <Label htmlFor="isPrivate">{t("is-private")}</Label>
              </section>

              <div>
                <ProfilePictureUploader
                  setFile={(INPUTfILE) =>
                    setFile({
                      file: INPUTfILE,
                      id: createId(),
                      uploaded: false,
                    })
                  }
                  url={
                    file?.file
                      ? URL.createObjectURL(file.file)
                      : profilePicture ?? null
                  }
                  createPlaceholder
                  author={slug}
                />
              </div>

              <div>
                <Button disabled={isSubmitting} type="submit">
                  {t("submit")}
                </Button>
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem disabled={!id} value="item-2">
          <AccordionTrigger className="flex justify-start gap-2 w-full">
            <UserPlus2 />
            <span className="w-full text-start">{t("manage-members")}</span>
          </AccordionTrigger>
          <AccordionContent>
            <MultipleUserInput galleryId={id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

function MultipleUserInput({ galleryId }: { galleryId?: number }) {
  const t = useClientTranslation("gallery-editor");
  const [inputQuery, setInputQuery] = useState<string>("");

  const { data: galleryUsers, refetch: refetchGallery } = useQuery({
    queryKey: ["gallery-users", galleryId],
    queryFn: async () => {
      const DefaultSelectedUser = await getGalleryUsersIds({
        id: galleryId as number,
      })
        .then((response) => response[0] ?? [])
        .catch(() => []);
      return DefaultSelectedUser;
    },
    initialData: [],
  });

  const { data } = useQuery({
    queryKey: ["users", inputQuery, galleryUsers],
    queryFn: async () => {
      return await searchUsers({
        q: inputQuery,
        take: 5 + galleryUsers.length,
        include: galleryUsers,
      })
        .then((response) =>
          (response[0] ?? []).map((user) => ({
            value: user.id as string,
            label: user.name ?? user.username ?? "",
            image: user.image,
          }))
        )
        .catch((e) => []);
    },
    initialData: [],
  });

  const handleChange = async (values: string[]) => {
    if (galleryUsers.length < values.length) {
      await addUserToGallery({
        galleryId: galleryId as number,
        userId: values.find(
          (id) => !(galleryUsers as string[]).includes(id)
        ) as string,
      });
    } else {
      await removeUserFromGallery({
        galleryId: galleryId as number,
        userId: values.find((id) =>
          (galleryUsers as string[]).includes(id)
        ) as string,
      });
    }
    refetchGallery();
  };

  return (
    <section className="p-4 w-full">
      <MultiSelect
        options={data}
        onValueChange={handleChange}
        defaultValue={galleryUsers as string[]}
        placeholder={t("select-users")}
        variant="secondary"
        animation={2}
        maxCount={3}
        setInputQuery={setInputQuery}
      />
    </section>
  );
}
