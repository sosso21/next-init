import { redirect } from "next/navigation";
import { LocaleGallerySlugParamsType } from "./types";

export default async function Home({ params }: LocaleGallerySlugParamsType) {
  redirect(`/${params.locale}/gallery/${params.slug}/1`);
  return <></>;
}
