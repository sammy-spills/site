import type { Metadata } from "next";
import { RSVPGate } from "@/components/rsvp/rsvp-gate";

export const metadata: Metadata = {
  title: "RSVP",
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

export default function RSVPPage() {
  return <RSVPGate/>;
}
