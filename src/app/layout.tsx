import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarLayout } from "@/components/sidebar-layout";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
