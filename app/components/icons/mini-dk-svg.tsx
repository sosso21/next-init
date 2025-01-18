import { cn } from "@/lib/utils";

export default function Mini_DK_SVG({
  className = "",
  size = "w-6 h-6",
  bgColor = "fill-secondary",
  textColor = "fill-secondary-foreground",
  fontSize = "10",
  fontWeight = "bold",
}: {
  className?: string;
  size?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
}) {
  return (
    <svg
      className={cn(size, bgColor, "rounded-sm", className)}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="24" height="24" rx="4" ry="4" className={bgColor} />
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight={fontWeight}
        className={textColor}
      >
        DK
      </text>
    </svg>
  );
}
