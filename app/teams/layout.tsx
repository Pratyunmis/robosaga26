import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Team",
  description:
    "Register your team for RoboSaga'26 at BIT Mesra. Create a new team or join an existing one using a team code. Teams of 2-4 members allowed.",
  keywords: [
    "team registration",
    "RoboSaga registration",
    "hackathon registration",
    "robotics competition registration",
    "BIT Mesra event registration",
  ],
  openGraph: {
    title: "Register Team | RoboSaga'26",
    description:
      "Register your team for RoboSaga'26! Create or join a team to participate in exciting robotics events.",
  },
};

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
