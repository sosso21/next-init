import { cn } from "@/lib/utils";

import { Button, ButtonProps } from "./button";
import { LucideIcon, LucideProps, MoveRight } from "lucide-react";

export const TriggerButton = ({
  icon: Icon = MoveRight,
  ...props
}: ButtonProps & {
  icon?: LucideIcon;
}) => {
  return (
    <Button
      {...props}
      className={cn(
        "relative flex justify-center px-4 py-2 rounded-md overflow-hidden group/modal-btn",
        props.className
      )}
    >
      <span className="text-center transition group-hover/modal-btn:translate-x-[100vw] duration-500">
        {props.children}
      </span>
      <div className="z-20 absolute inset-0 flex justify-center items-center transition -translate-x-[100vw] group-hover/modal-btn:translate-x-0 duration-500">
        <Icon />
      </div>
    </Button>
  );
};
