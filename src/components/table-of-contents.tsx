"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from '@/lib/utils';

interface TocItem {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
  title?: string;
}

export function TableOfContents({ items, className, title }: TableOfContentsProps) {
  const pathname = usePathname();

  // Calculate the minimum level from the actual content items (not including title)
  const contentMinLevel = items.length > 0 ? Math.min(...items.map((item) => item.level)) : 0;
  
  // When title is present, we want it to be level 1 and content to start from level 2
  // So we adjust the minLevel to account for the title
  const effectiveMinLevel = title ? 1 : contentMinLevel;

  // Build the full list of items to render
  const allItems: TocItem[] = [];
  
  // If title is provided, add it as the first item linking to top of page
  if (title) {
    allItems.push({
      level: 1,
      text: title,
      id: "top",
    });
  }
  
  // Add all the actual heading items
  allItems.push(...items);

  if (allItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-2", className)}>
      <h2 className="text-sm font-semibold text-muted-foreground mb-4">
        Table of Contents
      </h2>
      <ul className="space-y-1">
        {allItems.map((item) => {
          // For the title, always use level 1
          // For content items, adjust their level to be relative to effectiveMinLevel
          const isTitle = item.id === "top";
          const displayLevel = isTitle ? 1 : item.level;
          const indentLevel = displayLevel - effectiveMinLevel;
          
          return (
            <li
              key={item.id}
              className={cn(
                "pl-4",
                {
                  "pl-0": indentLevel === 0,
                  "pl-4": indentLevel === 1,
                  "pl-8": indentLevel === 2,
                  "pl-12": indentLevel >= 3,
                }
              )}
              style={{ marginLeft: `${indentLevel * 1}rem` }}
            >
              <Link
                href={`${pathname}#${item.id}`}
                className={cn(
                  "block text-sm rounded-md px-2 py-1 transition-colors",
                  "hover:bg-muted hover:text-foreground",
                  {
                    "font-medium text-foreground": indentLevel === 0,
                    "text-muted-foreground": indentLevel > 0,
                  }
                )}
                scroll={false}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.id === "top") {
                    // Scroll to top of the page
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    // Update URL without adding to history
                    window.history.replaceState(null, "", "#top");
                  } else {
                    const target = document.getElementById(item.id);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                      // Update URL without adding to history
                      window.history.replaceState(null, "", `#${item.id}`);
                    }
                  }
                }}
              >
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
