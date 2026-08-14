import type { Metadata } from "next";
import { DM_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { SidebarLayout } from "@/components/sidebar-layout";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/lib/data";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: site.seo.defaultTitle,
    template: `%s — ${site.seo.defaultTitle}`,
  },
  description: site.seo.defaultDescription,
  icons: {
    icon: "/favicon.webp",
  },
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
      <body className={`${manrope.variable} ${dmMono.variable} ${instrumentSerif.variable} antialiased`}>
        <ThemeProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
