import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Explore all events at RoboSaga'26 - HackAway hackathon, Robotics Exhibition, Blindfold Droid Trooper, Robotics Workshop, Burst n Brawl, and Speaker Sessions. 23-25 January 2026 at BIT Mesra.",
  keywords: [
    "RoboSaga events",
    "robotics events",
    "hackathon",
    "robotics workshop",
    "robotics exhibition",
    "tech events BIT Mesra",
  ],
  openGraph: {
    title: "Events | RoboSaga'26",
    description:
      "Discover exciting events at RoboSaga'26 - hackathon, workshops, exhibitions & more. 23-25 January 2026.",
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
