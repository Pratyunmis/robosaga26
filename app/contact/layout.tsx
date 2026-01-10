import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the RoboSaga'26 organizing team. Contact Robolution, the official robotics club of BIT Mesra for queries, sponsorships, and collaborations.",
  keywords: [
    "contact RoboSaga",
    "Robolution contact",
    "BIT Mesra robotics club",
    "Team Pratyunmis contact",
  ],
  openGraph: {
    title: "Contact Us | RoboSaga'26",
    description:
      "Contact the RoboSaga'26 team for queries, sponsorships, and collaborations.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
