"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Footnote component for use in MDX content.
 *
 * Usage in MDX:
 * ```mdx
 * Here is some text with a footnote.<Footnote id="1">This is the footnote text.</Footnote>
 *
 * More text.<Footnote id="2">Another footnote.</Footnote>
 *
 * <Footnotes />
 * ```
 *
 * Or with the content as children:
 * ```mdx
 * Here is a reference.<Footnote id="source">Source: Example.com</Footnote>
 *
 * <Footnotes />
 * ```
 */

// Store footnote definitions globally for the page
const footnoteStore = new Map<
  string,
  { index: number; content: React.ReactNode }
>();

// Track which footnotes have been registered
const registeredFootnotes = new Set<string>();

// Auto-incrementing index for unnamed footnotes
let nextFootnoteIndex = 1;

interface FootnoteProps {
  id: string;
  children: React.ReactNode;
}

interface FootnotesProps {
  className?: string;
}

/**
 * Individual footnote reference that appears inline in the text.
 * Shows a superscript number and displays a tooltip on hover.
 */
export function Footnote({ id, children }: FootnoteProps) {
  // Register the footnote on first render
  if (!registeredFootnotes.has(id)) {
    registeredFootnotes.add(id);
    footnoteStore.set(id, {
      index: nextFootnoteIndex++,
      content: children,
    });
  }

  const footnote = footnoteStore.get(id);
  const [isHovered, setIsHovered] = useState(false);
  const supRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(0);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  const updateTooltip = () => {
    if (supRef.current) {
      const rect = supRef.current.getBoundingClientRect();
      // For fixed positioning, use viewport-relative coordinates
      setTop(rect.bottom + 8);
    }
    if (tooltipRef.current) {
      setTooltipHeight(tooltipRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    if (isHovered) {
      updateTooltip();
    }
  }, [isHovered]);

  if (!footnote) {
    return null;
  }

  return (
    <>
      <sup
        ref={supRef}
        id={`fnref-${id}`}
        className="text-primary cursor-help font-medium no-underline"
        data-footnote-ref
        data-footnote-id={id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <a href={`#fn-${id}`} className="no-underline">
          {footnote.index}
        </a>
      </sup>
      {/* Tooltip in document flow that pushes content down */}
      <div
        ref={tooltipRef}
        className={`block transition-all duration-200 ease-in-out overflow-hidden shadow-[inset_0_0_6px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_6px_rgba(0,0,0,0.95)] ${
          isHovered ? "py-2" : "h-0"
        }`}
        // style={{
        //   position: "absolute",
        //   left: "0",
        //   width: "calc(100vw - var(--sidebar-width))",
        // }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="mx-auto max-w-prose rounded-md py-2 px-3 text-sm whitespace-normal wrap-break-word">
          <div className="prose dark:prose-invert prose-lg">
            {footnote.content}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Renders all registered footnotes at the bottom of the article.
 * Should be placed at the end of the MDX content.
 */
export function Footnotes({ className }: FootnotesProps) {
  const footnotes = Array.from(footnoteStore.entries()).sort(
    (a, b) => a[1].index - b[1].index,
  );

  if (footnotes.length === 0) {
    return null;
  }

  return (
    <div
      className={`mt-12 border-t border-border pt-6 text-muted-foreground text-sm ${className}`}
      data-footnotes
    >
      <h3 className="sr-only">Footnotes</h3>
      <ol className="list-none pl-0">
        {footnotes.map(([id, { index, content }]) => (
          <li key={id} id={`fn-${id}`} className="my-2" data-footnote-id={id}>
            <span className="mr-2 font-medium text-primary">{index}.</span>
            <span className="prose dark:prose-invert">{content}</span>
            <a
              href={`#fnref-${id}`}
              className="ml-2 text-muted-foreground no-underline"
              data-footnote-backref
              aria-label="Back to reference"
            >
              ↩
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Reset the footnote store (useful for testing or multiple pages)
 */
export function resetFootnotes() {
  footnoteStore.clear();
  registeredFootnotes.clear();
  nextFootnoteIndex = 1;
}
