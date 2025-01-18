import { redirect } from "next/navigation";
import { LocaleParamsType } from "../../types";

export default async function Home({ params }: LocaleParamsType) {
  redirect(`/${params.locale}/dashboard/contest-winning/1`);

  return <></>;
}
