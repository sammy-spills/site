"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resetFootnotes } from "./footnote";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/rsvp" || pathname === "/maple-two";
  const contentPaddingTop = isStandalonePage ? "pt-0" : "pt-10";

  // biome-ignore lint/correctness/useExhaustiveDependencies: The pathname change is the reset trigger.
  useEffect(() => {
    // Reset footnotes when navigating to a new route to prevent
    // footnote content from persisting across different pages
    resetFootnotes();
  }, [pathname]);

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 76)",
            "--header-height": "calc(var(--spacing) * 16)",
          } as React.CSSProperties
        }
      >
        {!isStandalonePage && <AppSidebar />}
        <SidebarInset>
          {!isStandalonePage && <SiteHeader />}
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
