"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const labelMap: Record<string, string> = {
  blog: "Blog",
  cv: "CV",
  publications: "Publications",
};

function useBreadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") {
    return [{ label: "Home", href: "/" }];
  }

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const href = `/${segments.slice(0, i + 1).join("/")}`;
    const label =
      labelMap[segment] ??
      segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, href });
  }

  return crumbs;
}

export function SiteHeader() {
  const pathname = usePathname();
  const crumbs = useBreadcrumbs();
  const showSidebarTrigger = pathname !== "/rsvp";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {showSidebarTrigger && <SidebarTrigger className="-ml-1" />}
        {pathname !== "/rsvp" && (
          <>
            <Separator
              className="mx-2 h-4 data-vertical:self-auto"
              orientation="vertical"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((crumb, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <Fragment key={crumb.href}>
                      {i > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink render={<Link href={crumb.href} />}>
                            {crumb.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
        <p className="ml-auto hidden font-mono text-[0.62rem] text-muted-foreground uppercase tracking-[0.14em] sm:block">
          Research engineering / portfolio
        </p>
      </div>
    </header>
  );
}
