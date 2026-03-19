import type { MDXComponents } from "mdx/types";

function isExternalUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      if (href && isExternalUrl(href)) {
        return (
          <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
            {children}
          </a>
        );
      }
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
    ...components,
  };
}
