import { auth } from "@/auth";
import { AuthForm } from "../../components/authForm";
import { LocaleParamsType } from "../types";
import { Footer } from "@/app/components/footer";

export default function Home({ params }: LocaleParamsType) {
  return (
    <main className="bg-[url('/pictures/auth/tumblr_dark_camera.webp')] dark:bg-[url('/pictures/auth/tumblr_light_camera.webp')] bg-cover bg-no-repeat w-full h-screen">
      <section className="flex justify-center items-center bg-[url('/pictures/auth/dark_camera.webp')] dark:bg-[url('/pictures/auth/light_camera.webp')] bg-cover bg-no-repeat py-24 w-full min-h-full">
        <AuthForm locale={params.locale} />
      </section>
    </main>
  );
}
