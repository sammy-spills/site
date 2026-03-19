import type { Metadata } from "next";
import { SidebarLayout } from "@/components/sidebar-layout";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: site.seo.defaultTitle,
    template: `%s — ${site.seo.defaultTitle}`,
  },
  description: site.seo.defaultDescription,
  openGraph: {
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
    images: [site.seo.defaultImage],
    siteName: site.seo.defaultTitle,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
