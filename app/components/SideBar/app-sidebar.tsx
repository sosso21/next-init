import { Home, LogOut, LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Lang } from "@/lib/use-translation/types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { UserProfileOrAuth } from "../Header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { LocaleModeToggle } from "@/components/LocaleModeToggle";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Mini_DK_SVG from "../icons/mini-dk-svg";
import { DKPhotographLightIcon } from "../icons/Icons";

type NavigationItem = {
  title: string;
  url?: string;
  icon: LucideIcon;
  subItems?: NavigationItem[];
  defaultOpen?: boolean;
};

export async function AppSidebar({ locale }: { locale: Lang }) {
  const t = useServerTranslation(locale, "sidebar-demo");

  const profileOrAuth = await UserProfileOrAuth({ locale });

  const navigation: NavigationItem[] = [
    {
      title: t("home-page"),
      url: `/${locale}`,
      icon: Home,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-end group-data-[collapsible=icon]:justify-center gap-x-2">
                <LocaleModeToggle
                  size="icon"
                  variant="ghost"
                  className="group-data-[collapsible=icon]:hidden w-7 h-7"
                />
                <ThemeModeToggle
                  size="icon"
                  variant="ghost"
                  className="group-data-[collapsible=icon]:hidden w-7 h-7"
                />
                <SidebarTrigger />
              </SidebarMenuItem>

              <SidebarMenuItem className="flex justify-center my-4">
                <Link aria-label={t("title")} href={`/${locale}`}>
                  <DKPhotographLightIcon className="group-data-[collapsible=icon]:hidden" />
                  <Mini_DK_SVG className="group-data-[collapsible=icon]:block hidden" />
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) =>
                item.subItems ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={item.defaultOpen ?? false}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton Collapsible>
                          {<item.icon />}
                          <span> {item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <Link
                              aria-label={subItem.title}
                              key={subItem.title}
                              href={subItem.url ?? "#"}
                            >
                              <SidebarMenuSubItem>
                                <SidebarMenuButton>
                                  <subItem.icon /> <span>{subItem.title}</span>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>{" "}
                            </Link>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link aria-label={item.title} href={item.url ?? "#"}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center">
              <SidebarMenuButton asChild>
                <Link href={profileOrAuth.url} aria-label={profileOrAuth.title}>
                  {profileOrAuth.icon}
                  <span>{profileOrAuth.title}</span>
                </Link>
              </SidebarMenuButton>

              {!!profileOrAuth.auth && (
                <form
                  className="group-data-[collapsible=icon]:hidden"
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button
                    variant="outline"
                    className="flex gap-2 cursor-pointer self-end"
                    type="submit"
                  >
                    <LogOut size={"1rem"} />
                  </Button>
                </form>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarFooter>
    </Sidebar>
  );
}
 