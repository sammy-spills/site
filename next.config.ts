import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { siteConfig } from "./src/lib/site-config";

const nextConfig: NextConfig = {
  output: "export",
  basePath: siteConfig.basePath,
  assetPrefix: siteConfig.basePath || undefined,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-slug"],
  },
});

export default withMDX(nextConfig);
