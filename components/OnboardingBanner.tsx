"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function OnboardingBanner() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (pathname.startsWith("/onboarding")) return null;

  if (!session?.user) return null;

  const incomplete =
    !session.user.rollNo || !session.user.branch || !session.user.phoneNo;

  if (!incomplete) return null;

  return (
    <div className="fixed top-16 left-0 w-full z-40 bg-yellow-400 text-black px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-md">
      <AlertTriangle className="h-4 w-4" />
      <span>
        Your profile is incomplete. Please finish onboarding to participate in
        events.
      </span>
      <Link
        href="/onboarding"
        className="underline hover:text-gray-800 font-bold ml-2"
      >
        Complete Now &rarr;
      </Link>
    </div>
  );
}
