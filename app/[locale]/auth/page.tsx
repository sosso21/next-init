import { AuthForm } from "../../components/authForm";
import { LocaleParamsType } from "../types";
export default async function Home({ params }: LocaleParamsType) {
  const locale = (await params).locale;
  return (
    <main className="bg-[url('/pictures/auth/tumblr_dark_camera.webp')] dark:bg-[url('/pictures/auth/tumblr_light_camera.webp')] bg-cover bg-no-repeat w-full h-screen">
      <section className="flex justify-center items-center bg-[url('/pictures/auth/dark_camera.webp')] dark:bg-[url('/pictures/auth/light_camera.webp')] bg-cover bg-no-repeat py-24 w-full min-h-full">
        <AuthForm locale={locale} />
      </section>
    </main>
  );
}
