import { GalleryEditor } from "@/app/components/gallery-editor";
import { LocaleParamsType } from "../../types";
import { Footer } from "@/app/components/footer";

export default function Home({ params }: LocaleParamsType) {
  return (
    <main className="flex flex-col justify-between items-center pt-8 w-full min-h-screen">
      <GalleryEditor />
      <Footer locale={params.locale} />
    </main>
  );
}
