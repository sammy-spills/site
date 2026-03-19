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
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarProfile profile={site.profile} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <SidebarSocial social={site.social} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
