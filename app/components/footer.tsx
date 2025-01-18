import { Dock, DockIcon } from "@/components/ui/dock";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { cn } from "@/lib/utils";
import { InstagramLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

import { MailIcon } from "lucide-react";
import { CLIENT_STATIC_FILES_RUNTIME_POLYFILLS } from "next/dist/shared/lib/constants";
import Link from "next/link";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function Footer({
  locale,
  className,
}: {
  locale: Lang;
  className?: string;
}) {
  const t = useServerTranslation(locale, "footer");
  const socialMedia = [
    {
      link: "https://github.com/",
      icon: LinkedInLogoIcon,
    },
    {
      link: "https://instagram.com/",
      icon: InstagramLogoIcon,
    },
    {
      link: "https://facebook.com/",
      icon: Icons.Facebook,
    },
    {
      link: "https://whatsapp.com/",
      icon: Icons.whatsapp,
    },
    {
      link: "mailto:dk@dk.com",
      icon: MailIcon,
    },
  ];
  return (
    <div
      className={cn(
        "flex flex-col-reverse flex-wrap justify-center items-center my-10 p-3 pb-16",
        className
      )}
    >
      <span className="mx-auto">
        {" "}
        {t("copyright")} - {new Date().getFullYear()}{" "}
      </span>
      <Dock magnification={60} distance={100}>
        {socialMedia.map(({ link, icon: IconMedia }, idx) => (
          <DockIcon key={idx} className="p-3 bg-ring">
            <Link aria-label={link} target="_blank" href={link}>
              <IconMedia className="size-full" />
            </Link>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}

const Icons = {
  Facebook: (props: IconProps) => (
    <svg
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m22 16.19c0 3.64-2.17 5.81-5.81 5.81h-1.19c-.55 0-1-.45-1-1v-5.77c0-.27.22-.5.49-.5l1.76-.03c.14-.01.26-.11.29-.25l.35-1.91c.03-.18-.11-.35-.3-.35l-2.13.03c-.28 0-.5-.22-.51-.49l-.04-2.45c0-.16.13-.29999.3-.29999l2.4-.04001c.17 0 .3-.12999.3-.29999l-.04-2.40002c0-.17-.13-.29999-.3-.29999l-2.7.04001c-1.66.03-2.98 1.38999-2.95 3.04999l.05 2.75c.01.28-.21.5-.49.51l-1.2.02c-.17 0-.29999.13-.29999.3l.03 1.9c0 .17.12999.3.29999.3l1.2-.02c.28 0 .5.22.51.49l.09 5.7c.01.56-.44 1.02-1 1.02h-2.3c-3.64 0-5.81-2.17-5.81-5.82v-8.37c0-3.64 2.17-5.81 5.81-5.81h8.38c3.64 0 5.81 2.17 5.81 5.81z"
        className="fill-foreground"
      />
    </svg>
  ),

  whatsapp: (props: IconProps) => (
    <svg
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="m18.403 5.633c-1.695-1.697-3.949-2.632-6.35-2.633-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488l-1.273 4.651 4.759-1.249c1.312.715 2.788 1.092 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977 0-2.398-.932-4.653-2.627-6.35m-6.35 13.812h-.003c-1.339-.001-2.652-.36-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282c-.747-1.188-1.141-2.561-1.141-3.971.002-4.114 3.349-7.461 7.465-7.461 1.993.001 3.866.778 5.275 2.188 1.408 1.411 2.184 3.285 2.183 5.279-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393s.149-.224.224-.374.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383-.13-.006-.28-.008-.429-.008-.15 0-.393.056-.599.28-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321 1.582 2.415 3.832 3.387c.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066s.187-.973.131-1.067-.207-.151-.43-.263"
        className="fill-foreground"
      />
    </svg>
  ),
};
