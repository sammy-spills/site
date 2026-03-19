import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TAG_ACRONYMS = new Set(["ai", "tea"]);
const TAG_WHITESPACE = /\s+/;

export function formatTag(tag: string) {
  const capitalised = tag
    .split(TAG_WHITESPACE)
    .map((w) =>
      TAG_ACRONYMS.has(w)
        ? w.toUpperCase()
        : w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");
  return capitalised;
}
