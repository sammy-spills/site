"use client";

import type { ComponentProps } from "react";
import { NavMain } from "@/components/nav-main";
import { SidebarProfile } from "@/components/sidebar-profile";
import { SidebarSocial } from "@/components/sidebar-social";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { site } from "@/lib/data";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="border-sidebar-border/80"
      collapsible="icon"
      variant="inset"
      {...props}
    >
      <SidebarHeader className="border-sidebar-border/70 border-b p-0">
        <SidebarProfile profile={site.profile} />
      </SidebarHeader>
      <SidebarContent className="gap-0 py-4">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border/70 border-t p-0">
        <SidebarSocial social={site.social} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
