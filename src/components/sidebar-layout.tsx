"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contentPaddingTop = pathname === "/rsvp" ? "pt-0" : "pt-10";

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div
            className={`flex flex-1 flex-col gap-4 px-6 pb-6 ${contentPaddingTop} md:px-10 lg:px-16`}
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
