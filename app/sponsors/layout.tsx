import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Partner with RoboSaga'26 at BIT Mesra. Explore sponsorship opportunities for Title, Gold, and Silver tiers. Reach 5000+ participants and gain brand visibility.",
  keywords: [
    "RoboSaga sponsors",
    "robotics event sponsorship",
    "BIT Mesra sponsorship",
    "tech fest sponsorship",
    "college event sponsorship",
  ],
  openGraph: {
    title: "Become a Sponsor | RoboSaga'26",
    description:
      "Partner with RoboSaga'26! Reach 5000+ participants. Title, Gold & Silver sponsorship packages available.",
  },
};

export default function SponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
