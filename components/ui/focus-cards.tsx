"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { servicePage } from "@prisma/client";
import Link from "next/link";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { Images, LockKeyhole, LockKeyholeOpen } from "lucide-react";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: CardType;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const t = useClientTranslation("focus-cards");
    return (
      <Link
        href={card.href}
        aria-label={`Focus Card ${card.title}`}
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
      >
        <Image
          src={card.src}
          alt={card.title}
          blurDataURL={card.blurDataURL}
          placeholder={!!card.blurDataURL ? "blur" : "empty"}
          fill
          className="absolute inset-0 object-cover"
        />

        <div
          className={cn(
            "absolute inset-0 flex   py-8 px-4 transition-opacity duration-300",
            hovered != index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex justify-center items-center bg-secondary rounded-full w-12 h-12 font-medium text-lg md:text-xl">
            {`#${card.id}`}
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex flex-col justify-end py-8 px-4 transition-opacity duration-300 capitalize",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center gap-4 bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-200 font-medium text-transparent text-xl md:text-2xl">
            {card.private ? (
              <LockKeyhole className="text-white mr" />
            ) : (
              <LockKeyholeOpen className="text-white mr" />
            )}
            {card.title}
          </div>
          <div className="flex items-center gap-4 text-white">
            <p className="flex items-center gap-2">
              <Images />
              {card.imagesCount.toString()} {t("images")}
            </p>
            <p className={cn({ hidden: card.category })}>
              {" "}
              ・ {t(`${card.category}`)}{" "}
            </p>
          </div>
        </div>
      </Link>
    );
  }
);

Card.displayName = "Card";

export type CardType = {
  id: number;
  title: string;
  src: string;
  blurDataURL: string;
  href: string;
  private: boolean;
  category: servicePage | null;
  imagesCount: number;
  images: {
    id: number;
    webp: string;
    tumblr: string;
    host: string;
  }[];
  users:
    | {
        id: string;
        name: string | null;
        username: string | null;
      }[]
    | null;
};

export function FocusCards({
  cards,
  className,
}: {
  cards: CardType[];
  className?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid w-full max-w-5xl grid-cols-1 gap-10 mx-auto md:grid-cols-3 md:px-8",
        className
      )}
    >
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
