import { SpotlightPreview } from "@/app/components/SpotlightPreview";
import { LocaleServiceParamsType, serviceEnumType } from "./types";
import { GridTextService } from "@/app/components/grid-text-service";
import { ParallaxScrollDemo } from "@/app/components/ParallaxScrollDemo";
import { ImagesSliderIntroduction } from "@/app/components/ImagesSliderIntroduction";
import { ContactUsSection } from "@/app/components/contact-us";

import { MarqueeDemo } from "@/app/components/MarqueeDemo";
import { Footer } from "@/app/components/footer";
import BentoGridDemo from "@/app/components/BentoGridDemo";
import { AnimatedTestimonialsDemo } from "@/app/components/AnimatedTestimonialsDemo";
import { InfiniteMovingCardsDemo } from "@/app/components/infinite-moving-reviews-cards";
export default function Home({ params }: LocaleServiceParamsType) {
  const service = params.service.toUpperCase() as serviceEnumType;
  return (
    <main className="flex flex-col justify-between items-center min-h-screen">
      <SpotlightPreview locale={params.locale} route={service} />
      <GridTextService locale={params.locale} route={service} />
      <ParallaxScrollDemo route={service} />
      <ImagesSliderIntroduction locale={params.locale} service={service} />
      <BentoGridDemo locale={params.locale} />
      <InfiniteMovingCardsDemo locale={params.locale} route={service} />
      <ContactUsSection locale={params.locale} />
      <MarqueeDemo locale={params.locale} />
      <AnimatedTestimonialsDemo locale={params.locale} route={service} />
      <Footer locale={params.locale} />
    </main>
  );
}
