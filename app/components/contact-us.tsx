import { Button } from "@/components/ui/button";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import Link from "next/link";
import { CustomMDX } from "./mdx-components";
import { MailMinusIcon, PhoneCallIcon } from "lucide-react";
import { emailDkPhotographe, phoneDkPhotographe } from "@/constants";
import { contactSubject } from "@prisma/client";

export const ContactUsSection = ({ locale }: { locale: Lang }) => {
  const t = useServerTranslation(locale, "contact-us-section");

  return (
    <section className="flex flex-row md:flex-row-reverse flex-wrap justify-center items-start my-5 md:my-20 w-full">
      <div className="my-8 px-2">
        <article className="flex flex-col justify-center items-center">
          <span className="">
            <h3 className="my-2 w-full text-2xl">{t("ask-for-quote")}</h3>
            <div className="my-4 max-w-sm font-light text-lg">
              <CustomMDX source={t("ask-for-quote-description")} />
            </div>
          </span>
          <span className="flex justify-center items-center">
            <Link
              aria-label={t("ask-for-quote")}
              className="mx-0.5"
              href={`/${locale}/dashboard/contact-us?subject=${contactSubject.QUOTE_REQUEST}`}
            >
              <Button variant={"ghost"}> {t("ask-for-quote")} </Button>
            </Link>

            <Link
              aria-label={t("contact-us")}
              className="mx-0.5"
              href={`/${locale}/dashboard/contact-us?subject=${contactSubject.CONTACT_US}`}
            >
              <Button> {t("contact-us")} </Button>
            </Link>
          </span>
        </article>
      </div>

      <div className="my-8 md:basis-1/2 flex flex-col justify-center items-start px-2">
        <span>
          <h2 className="mx-auto my-2 text-2xl">
            <CustomMDX source={t("contact-us")} />{" "}
          </h2>
          <div className="font-light text-lg text-start">
            <ul className="flex flex-col justify-start items-start mx-4">
              <li className="flex justify-start items-start">
                <PhoneCallIcon />
                <Link
                  aria-label={phoneDkPhotographe}
                  className="mx-2"
                  href={`tel:${phoneDkPhotographe}`}
                >
                  {phoneDkPhotographe}
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <MailMinusIcon />
                <Link
                  aria-label={emailDkPhotographe}
                  className="mx-2"
                  href={`mailto:${emailDkPhotographe}`}
                >
                  {emailDkPhotographe}
                </Link>
              </li>
            </ul>
          </div>
        </span>
      </div>
    </section>
  );
};
