export const dkPhtographeLight = "/pictures/DKphotographe-logo-light.svg";
export const dkPhtographeDark = "/pictures/DKphotographe-logo-dark.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
export const DKPhotographLightIcon = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <i className={cn("inline w-full h-full", className)}>
      <Image
        width={150}
        height={150}
        className="inline dark:hidden"
        alt="dkphtographe logo light"
        src={dkPhtographeLight}
      />
      <Image
        width={150}
        height={150}
        className="dark:inline hidden"
        alt="dkphtographe logo dark"
        src={dkPhtographeDark}
      />
    </i>
  );
};
