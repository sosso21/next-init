import { SpotlightPreview } from "../components/SpotlightPreview";

import { LocaleParamsType } from "./types";
import { ImagesSliderIntroduction } from "../components/ImagesSliderIntroduction";
import { ParallaxScrollDemo } from "../components/ParallaxScrollDemo";

import { GridTextService } from "../components/grid-text-service";
import { ContactUsSection } from "../components/contact-us";
import { Footer } from "../components/footer";
import { MarqueeDemo } from "../components/MarqueeDemo";
import BentoGridDemo from "../components/BentoGridDemo";
import { AnimatedTestimonialsDemo } from "../components/AnimatedTestimonialsDemo";
import { InfiniteMovingCardsDemo } from "../components/infinite-moving-reviews-cards";

export default function Home({ params }: LocaleParamsType) {
  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <SpotlightPreview locale={params.locale} />
      <GridTextService locale={params.locale} />
      <ParallaxScrollDemo />
      <ImagesSliderIntroduction locale={params.locale} />
      <BentoGridDemo locale={params.locale} />
      <InfiniteMovingCardsDemo locale={params.locale} />
      <ContactUsSection locale={params.locale} />
      <MarqueeDemo locale={params.locale} />
      <AnimatedTestimonialsDemo locale={params.locale} />
      <Footer locale={params.locale} />
    </main>
  );
}

/*

*/
