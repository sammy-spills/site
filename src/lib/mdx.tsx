import { useMDXComponents } from "../../mdx-components";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { extractHeadings } from "./toc";

interface MdxResult {
  content: React.ReactNode;
  headings: Array<{ level: number; text: string; id: string }>;
}

export async function renderMdx(source: string): Promise<React.ReactNode> {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  return <Content components={useMDXComponents({})} />;
}

export async function renderMdxWithToc(source: string): Promise<MdxResult> {
  // Extract headings from the raw markdown
  const headings = extractHeadings(source);

  // Process with MDX to add proper slugs and render
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });

  return {
    content: <Content components={useMDXComponents({})} />,
    headings,
  };
}

export { extractHeadings } from "./toc";
