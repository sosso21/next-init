import { Inter, Roboto_Mono } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const roboto_mono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const whisper_regular = localFont({
  src: "../../public/fonts/whisper-regular.ttf",

  variable: "--font-whisper-regular",
  style: "normal",
});
