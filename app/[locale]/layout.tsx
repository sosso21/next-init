import type { Metadata } from "next";

import "../globals.scss";

import { cn } from "@/lib/utils";
import { languages } from "@/lib/use-translation/languages-data";
import { languageDirection } from "@/lib/use-translation/direction";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProviders } from "../components/queryProviders";
import { Header } from "../components/Header";

import { inter, roboto_mono, whisper_regular } from "../font/fonts";
import { Ping } from "../components/ping";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../components/SideBar/app-sidebar";
import { ConfirmationDialog } from "../components/DialogConfirm/components/ConfirmationDialog";
import { RootChildrenType } from "./types";

export const metadata: Metadata = {
  title: "DK | Photographe",
  description: "DK | Photographe",
  icons: "/dk.svg",
};
export async function generateStaticParams() {
  return languages.map((locale) => ({
    locale,
  }));
}
export default async function RootLayout({
  children,
  params,
}: RootChildrenType) {
  const locale = (await params).locale;
  if (!languages.includes(locale)) {
    redirect(`/${process.env.DEFAULT_LANGUAGE}`);
  }

  return (
    <html
      lang={locale}
      dir={languageDirection(locale)}
      suppressHydrationWarning
    >
      <body
        className={cn(
          "bg-background",
          whisper_regular.variable,
          roboto_mono.variable,
          inter.variable
        )}
      >
        <AppProviders>
          <Ping />
          <ThemeProvider
            attribute="class"
            defaultTheme={
              process.env.NODE_ENV === "production" ? "light" : "system"
            }
            enableSystem
            disableTransitionOnChange
          >
            <ConfirmationDialog />

            <SidebarProvider className="md:flex-row flex-col overflow-x-hidden">
              <AppSidebar locale={locale} />
              <Header locale={locale} />
              {children}
            </SidebarProvider>
          </ThemeProvider>
        </AppProviders>
      </body>
    </html>
  );
}
