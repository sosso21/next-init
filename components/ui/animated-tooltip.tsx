"use client";
import Image from "next/image";
import { ReactNode, useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { parseAsInteger, useQueryState } from "nuqs";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: ReactNode;
    image: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const [_, set_show_review] = useQueryState("show_review", parseAsInteger);

  return (
    <>
      {items.map((item, idx) => (
        <div
          className={cn("relative group", idx == 0 ? "ml-3" : "-ml-3")}
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="-top-16 -left-1/2 z-50 absolute flex flex-col justify-center items-center bg-card shadow-xl px-4 py-2 rounded-md text-xs translate-x-1/2"
              >
                <div className="-bottom-px z-30 absolute inset-x-10 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-[20%] h-px" />
                <div className="-bottom-px left-10 z-30 absolute bg-gradient-to-r from-transparent via-primary to-transparent w-[40%] h-px" />
                <div className="relative z-30 font-bold text-base text-card-foreground">
                  {item.name}
                </div>
                <div className="text-card-foreground text-xs">
                  {item.designation}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Image
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            onClick={() => set_show_review(item.id)}
            className="group-hover:scale-105 group-hover:z-30 relative object-top border-2 border-white !m-0 !p-0 rounded-full w-14 h-14 transition duration-500 cursor-pointer object-cover"
          />
        </div>
      ))}
    </>
  );
};
