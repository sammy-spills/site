"use client";

import { GithubIcon, GlobeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Project } from "@/lib/schemas/content";

function ProjectLinkIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function ProjectCard({
  project,
  compact,
}: {
  project: Project;
  compact?: boolean;
}) {
  const hasLinks = project.websiteUrl ?? project.githubUrl;

  if (compact) {
    return (
      <TooltipProvider>
        <div className="flex items-baseline justify-between gap-3 py-0.5">
          <div className="flex min-w-0 flex-1 items-baseline gap-2">
            <h3 className="shrink-0 font-medium text-sm">{project.title}</h3>
            {project.role && (
              <Badge
                className="hidden text-muted-foreground sm:inline-flex"
                variant="outline"
              >
                {project.role}
              </Badge>
            )}
            <span className="truncate text-muted-foreground text-xs">
              {project.description}
            </span>
          </div>
          {hasLinks && (
            <div className="flex shrink-0 gap-0.5">
              {project.websiteUrl && (
                <ProjectLinkIcon
                  href={project.websiteUrl}
                  label="Visit website"
                >
                  <GlobeIcon className="size-3.5" />
                </ProjectLinkIcon>
              )}
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-start gap-5 py-1">
        {project.image && (
          <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-lg sm:block">
            <Image
              alt={project.title}
              className="object-cover"
              fill
              sizes="80px"
              src={project.image}
            />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg leading-tight">
              {project.title}
            </h3>
            {hasLinks && (
              <div className="flex shrink-0 gap-1">
                {project.websiteUrl && (
                  <ProjectLinkIcon
                    href={project.websiteUrl}
                    label="Visit website"
                  >
                    <GlobeIcon className="size-4" />
                  </ProjectLinkIcon>
                )}
                {project.githubUrl && (
                  <ProjectLinkIcon
                    href={project.githubUrl}
                    label="View source on GitHub"
                  >
                    <GithubIcon className="size-4" />
                  </ProjectLinkIcon>
                )}
              </div>
            )}
          </div>
          {project.role && (
            <Badge className="text-muted-foreground" variant="outline">
              {project.role}
            </Badge>
          )}
          <p className="text-muted-foreground text-sm/relaxed">
            {project.description}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
