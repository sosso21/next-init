import { Footer } from "../components/footer";
import { LocaleParamsType } from "./types";
export default async function Home({ params }: LocaleParamsType) {
  const locale = (await params).locale;
  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <Footer locale={locale} />
    </main>
  );
}

/*

*/
