import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HackAway | Overnight Hackathon",
  description:
    "HackAway - Overnight hackathon at RoboSaga'26, BIT Mesra. Build innovative software & hardware solutions. Win prizes worth ₹1,00,000+. 23-24 January 2026. Teams of 2-4 members.",
  keywords: [
    "HackAway",
    "hackathon",
    "overnight hackathon",
    "BIT Mesra hackathon",
    "coding competition",
    "RoboSaga hackathon",
    "software hackathon",
    "hardware hackathon",
    "tech hackathon",
    "Ranchi hackathon",
  ],
  openGraph: {
    title: "HackAway | Overnight Hackathon at RoboSaga'26",
    description:
      "Join HackAway overnight hackathon! Build innovative solutions, win ₹1,00,000+ in prizes. Software, Hardware & Combined tracks. 23-24 January 2026.",
    images: ["/hackaway/IMG_3641.JPG"],
  },
  twitter: {
    title: "HackAway | Overnight Hackathon",
    description:
      "Join HackAway overnight hackathon at RoboSaga'26! Win ₹1,00,000+ prizes. 23-24 January 2026.",
    images: ["/hackaway/IMG_3641.JPG"],
  },
};

export default function HackAwayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
