"use client";

import type { LucideIcon } from "lucide-react";
import {
  GithubIcon,
  GitlabIcon,
  GraduationCapIcon,
  LinkedinIcon,
  MailIcon,
  MoonIcon,
  SunIcon,
  TwitterIcon,
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
  email: MailIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  gitlab: GitlabIcon,
  scholar: GraduationCapIcon,
  x: TwitterIcon,
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
    <div className="flex flex-wrap items-center justify-center gap-1 px-2 py-1 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:px-0">
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
                className="pointer-events-none"
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

      <span className="group-data-[collapsible=icon]:!w-4 mx-1 h-4 w-px bg-border group-data-[collapsible=icon]:mx-0 group-data-[collapsible=icon]:h-px" />

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
              size="icon-sm"
              variant="ghost"
            />
          }
        >
          <SunIcon className="size-4 scale-100 dark:scale-0" />
          <MoonIcon className="absolute size-4 scale-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </TooltipTrigger>
        <TooltipContent side="top">Toggle theme</TooltipContent>
      </Tooltip>
    </div>
  );
}
