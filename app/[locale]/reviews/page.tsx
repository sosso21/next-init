import { redirect } from "next/navigation";
import { LocaleParamsType } from "../types";

export default async function Home({ params }: LocaleParamsType) {
  
    redirect(`/${params.locale}/reviews/1`);

  return <></>;
}
