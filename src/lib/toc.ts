interface TocItem {
  level: number;
  text: string;
  id: string;
}

/**
 * Generate a GitHub-style slug from text (matches rehype-slug behavior)
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/^\-+/, "")
    .replace(/\-+$/, "");
}

/**
 * Extract headings from markdown content and generate a table of contents
 * @param content - The markdown content as a string
 * @returns Array of TOC items with level, text, and generated ID
 */
export function extractHeadings(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  const usedIds = new Set<string>();

  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];

    // Generate slug similar to rehype-slug (github-slugger)
    let slug = generateSlug(text);

    // Ensure uniqueness by adding a counter if needed (like github-slugger does)
    let uniqueSlug = slug;
    let counter = 1;

    while (usedIds.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    usedIds.add(uniqueSlug);

    headings.push({
      level,
      text,
      id: uniqueSlug,
    });
  }

  // Reset regex state
  headingRegex.lastIndex = 0;

  return headings;
}

/**
 * Generate a nested table of contents structure from flat headings
 */
export function buildNestedToc(headings: TocItem[]): { items: TocItem[]; maxLevel: number } {
  if (headings.length === 0) {
    return { items: [], maxLevel: 0 };
  }

  const maxLevel = Math.max(...headings.map((h) => h.level));
  return { items: headings, maxLevel };
}
