"use client";

import {
  BookTextIcon,
  FileTextIcon,
  HomeIcon,
  PenLineIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Home", path: "/", icon: HomeIcon },
  { label: "Publications", path: "/publications", icon: BookTextIcon },
  { label: "CV", path: "/cv", icon: FileTextIcon },
  { label: "Blog", path: "/blog", icon: PenLineIcon },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="h-auto rounded-none px-4 pb-3 font-mono text-[0.68rem] text-sidebar-foreground/45 uppercase group-data-[collapsible=icon]:hidden">
        Navigation
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0 border-sidebar-border/70 border-y">
          {navItems.map((item, index) => {
            const isActive =
              item.path === "/"
                ? pathname === "/"
                : pathname.startsWith(item.path);

            return (
              <SidebarMenuItem
                className="border-sidebar-border/70 border-b last:border-b-0"
                key={item.path}
              >
                <SidebarMenuButton
                  className="relative h-11 rounded-none px-4 text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground data-active:bg-sidebar-accent data-active:text-sidebar-foreground group-data-[collapsible=icon]:!size-12 group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:!px-0 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-transparent data-active:before:bg-primary"
                  isActive={isActive}
                  render={<Link href={item.path} />}
                  tooltip={item.label}
                >
                  <span className="w-6 shrink-0 font-mono text-[0.68rem] text-sidebar-foreground/42 group-data-[collapsible=icon]:hidden">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <item.icon className="text-primary" />
                  <span className="font-medium group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
