import type { Metadata } from "next";
import { MapleTwoRsvpGate } from "@/components/maple-two/maple-two-rsvp-gate";

export const metadata: Metadata = {
  title: "Maple's Second Birthday RSVP",
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

export default function MapleTwoPage() {
  return (
    <div className="editorial-page">
      <MapleTwoRsvpGate />
    </div>
  );
}
