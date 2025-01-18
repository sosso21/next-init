"use client";

import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    id: number;
    link: string | null;
    title: string;
    description: string;
    picture: string | null;
    blurPicture?: string | null;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  const t = useClientTranslation("animated-testimonials");

  useEffect(() => {
    addAnimation();
  }, []);
  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20  max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            className="relative flex-shrink-0 bg-grid-white/[0.02] bg-background bg-cover bg-no-repeat bg-center px-8 py-6 border border-b-0 rounded-2xl w-[350px] md:w-[450px] max-w-full text-foreground"
            style={{
              background:
                "linear-gradient(180deg, var(--slate-800), var(--slate-900)",
            }}
            key={item.link}
          >
            {item.picture && (
              <Image
                src={item.picture}
                blurDataURL={item.blurPicture ?? ""}
                placeholder={!!item.blurPicture ? "blur" : "empty"}
                alt={item.title}
                fill
                priority
                quality={75}
                className="absolute inset-0 opacity-10 object-cover"
              />
            )}

            <blockquote>
              <div
                aria-hidden="true"
                className="-top-0.5 -left-0.5 -z-1 absolute w-[calc(100%_+_4px)] h-[calc(100%_+_4px)] pointer-events-none user-select-none"
              ></div>
              <span className="relative z-20 font-normal text-sm leading-[1.6]">
                {item.description}
              </span>
              <div className="relative z-20 flex flex-row items-center mt-6">
                <span className="flex flex-col gap-1">
                  <span className="font-normal text-sm leading-[1.6]">
                    {item.link ? (
                      <Link
                        href={item.link}
                        aria-label={item.title}
                        className="text-primary text-sm"
                      >
                        {t("read-more")}
                      </Link>
                    ) : (
                      <br />
                    )}
                  </span>
                  <span className="font-normal text-sm leading-[1.6]">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
