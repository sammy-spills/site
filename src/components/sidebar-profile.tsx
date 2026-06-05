"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Profile } from "@/lib/schemas/site";
import Link from "next/link";

interface SidebarProfileProps {
  profile: Profile;
}

export function SidebarProfile({ profile }: SidebarProfileProps) {
  const displayName = [profile.title, profile.fullName].filter(Boolean).join(" ");
  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <SidebarMenu className="gap-0">
      <SidebarMenuItem>
        <SidebarMenuButton
          className="data-[slot=sidebar-menu-button]:!h-auto rounded-none border-sidebar-border/70 border-b-0 px-4 py-5 hover:bg-sidebar-accent/70 data-[slot=sidebar-menu-button]:gap-3 group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!p-0"
          render={<Link href="/" />}
          size="lg"
          tooltip={displayName}
        >
          <div className="flex size-9 shrink-0 items-center justify-center border border-primary bg-primary font-semibold text-primary-foreground text-xs group-data-[state=expanded]:size-10 group-data-[state=expanded]:text-sm">
            {initials || "YN"}
          </div>
          <div className="grid flex-1 gap-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-sidebar-foreground text-sm">
              {displayName}
            </span>
            <span className="line-clamp-2 text-sidebar-foreground/62 text-xs leading-4">
              {profile.role}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
