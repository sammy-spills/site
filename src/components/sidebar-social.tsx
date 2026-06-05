"use client";

import type { LucideIcon } from "lucide-react";
import {
  Github,
  Gitlab,
  GraduationCap,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Twitter,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Social } from "@/lib/schemas/site";

const iconMap: Record<string, LucideIcon> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  gitlab: Gitlab,
  scholar: GraduationCap,
  x: Twitter,
};

const labelMap: Record<string, string> = {
  email: "Email",
  linkedin: "LinkedIn",
  github: "GitHub",
  gitlab: "GitLab",
  scholar: "Google Scholar",
  x: "X",
};

interface SidebarSocialProps {
  social: Social;
}

export function SidebarSocial({ social }: SidebarSocialProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const entries = Object.entries(social).filter(
    ([key, value]) => value && key in iconMap
  );

  return (
    <div className="grid gap-0 group-data-[collapsible=icon]:justify-items-center">
      <div className="grid grid-cols-4 border-sidebar-border/70 border-b group-data-[collapsible=icon]:grid-cols-1 group-data-[collapsible=icon]:border-b-0">
        {entries.map(([key, value]) => {
          const Icon = iconMap[key];
          const label = labelMap[key] ?? key;
          const href = key === "email" ? `mailto:${value}` : value;
          const isExternal = key !== "email";

          return (
            <Tooltip key={key}>
              <TooltipTrigger
                render={
                  <a
                    href={href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  />
                }
              >
                <Button
                  className="pointer-events-none h-11 w-full rounded-none border-sidebar-border/70 border-r text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-primary last:border-r-0 group-data-[collapsible=icon]:size-12 group-data-[collapsible=icon]:border-r-0 group-data-[collapsible=icon]:border-b"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              className="h-11 w-full rounded-none text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-primary group-data-[collapsible=icon]:size-12"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              size="sm"
              variant="ghost"
            />
          }
        >
          <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
            <Sun className="absolute size-4 scale-100 dark:scale-0" />
            <Moon className="absolute size-4 scale-0 dark:scale-100" />
          </span>
          <span className="ml-2 font-mono text-[0.68rem] uppercase group-data-[collapsible=icon]:sr-only">
            Theme
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">Toggle theme</TooltipContent>
      </Tooltip>
    </div>
  );
}
