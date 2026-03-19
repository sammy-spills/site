import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content");
const MDX_EXTENSION = /\.mdx$/;

interface ContentItem<T> {
  slug: string;
  metadata: T;
  content: string;
}

export function getContentBySlug<T>(
  directory: string,
  slug: string
): ContentItem<T> {
  const filePath = path.join(contentDirectory, directory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    metadata: data as T,
    content,
  };
}

export function getAllSlugs(directory: string): string[] {
  const dirPath = path.join(contentDirectory, directory);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(MDX_EXTENSION, ""))
    .filter((slug) => {
      const { metadata } = getContentBySlug<Record<string, unknown>>(
        directory,
        slug
      );
      return metadata.published !== false;
    });
}

export function getAllContent<T>(directory: string): ContentItem<T>[] {
  const dirPath = path.join(contentDirectory, directory);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".mdx"));

  const items = files
    .map((file) => {
      const slug = file.replace(MDX_EXTENSION, "");
      return getContentBySlug<T>(directory, slug);
    })
    .filter(
      (item) => (item.metadata as Record<string, unknown>).published !== false
    );

  return items.sort((a, b) => {
    const dateA = (a.metadata as Record<string, string>).date ?? "";
    const dateB = (b.metadata as Record<string, string>).date ?? "";
    return dateB.localeCompare(dateA);
  });
}
