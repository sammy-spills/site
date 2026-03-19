"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Profile } from "@/lib/schemas/site";

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
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          className="data-[slot=sidebar-menu-button]:!h-auto group-data-[collapsible=icon]:!p-0.5 group-data-[collapsible=icon]:!pl-[3px]"
          size="lg"
          tooltip={displayName}
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs group-data-[state=expanded]:size-8 group-data-[state=expanded]:text-sm">
            {initials || "YN"}
          </div>
          <div className="grid flex-1 text-left leading-tight">
            <span className="truncate font-semibold text-sm">
              {displayName}
            </span>
            <span className="truncate text-xs">{profile.role}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
