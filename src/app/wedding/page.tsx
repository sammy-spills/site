import type { Metadata } from "next";
import { WeddingGate } from "@/components/wedding/wedding-gate";

export const metadata: Metadata = {
  title: "Wedding",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function WeddingPage() {
  return <WeddingGate />;
}
