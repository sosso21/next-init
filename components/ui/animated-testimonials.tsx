"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import Link from "next/link";

export type Testimonial = {
  id: number;
  link: string | null;
  title: string;
  description: string;
  picture: string;
  blurPicture?: string | null;
};
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  delay = 5000,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  delay?: number;
}) => {
  const [active, setActive] = useState(0);
  const t = useClientTranslation("animated-testimonials");

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, delay);
      return () => clearInterval(interval);
    }
  }, [autoplay, delay, handleNext]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };
  return (
    <div className="mx-auto px-4 md:px-8 lg:px-12 py-20 max-w-sm md:max-w-4xl font-sans antialiased">
      <div className="relative gap-20 grid grid-cols-1 md:grid-cols-2">
        <div>
          <div className="relative w-full h-80">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 999
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <Image
                    src={testimonial.picture}
                    alt={testimonial.title}
                    placeholder={!!testimonial.blurPicture ? "blur" : "empty"}
                    blurDataURL={testimonial.blurPicture ?? ""}
                    width={500}
                    height={500}
                    draggable={false}
                    loading="lazy"
                    className="rounded-3xl bg-ring w-full h-full object-center object-cover"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="font-bold text-2xl">{testimonials[active].title}</h3>
            {testimonials[active].link ? (
              <Link
                href={testimonials[active].link}
                aria-label={testimonials[active].title}
                className="text-primary text-sm"
              >
                {t("read-more")}
              </Link>
            ) : (
              <br />
            )}
            <motion.p className="mt-8 text-lg">
              {(testimonials[active].description ?? "")
                .split(" ")
                .map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 md:pt-0">
            <Button
              variant={"ghost"}
              size="sm"
              onClick={handlePrev}
              className="rounded-full w-12 h-12"
            >
              <IconArrowLeft />
            </Button>
            <Button
              variant={"ghost"}
              size="sm"
              onClick={handleNext}
              className="rounded-full w-12 h-12"
            >
              <IconArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
