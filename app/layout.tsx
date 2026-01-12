import type { Metadata } from "next";
import { Inter, Orbitron, Rajdhani, Space_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://www.robosaga.robolutionbitm.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RoboSaga'26 - BIT Mesra's Premier Robotics Festival",
    template: "%s | RoboSaga'26",
  },
  description:
    "RoboSaga'26 - The Ultimate Robotics Festival at BIT Mesra, Ranchi. Join us for HackAway hackathon, robotics workshops, exhibitions, and speaker sessions. 23-25 January 2026. Organized by Robolution, the official robotics club of BIT Mesra.",
  keywords: [
    "RoboSaga",
    "RoboSaga 2026",
    "BIT Mesra",
    "Robolution",
    "robotics",
    "hackathon",
    "HackAway",
    "robotics festival",
    "robotics competition",
    "BIT Mesra robotics",
    "Ranchi robotics event",
    "college robotics",
    "tech fest",
    "engineering competition",
    "Jharkhand robotics",
    "Team Pratyunmis",
    "ABU Robocon",
  ],
  authors: [
    { name: "Robolution - BIT Mesra", url: siteUrl },
    { name: "Team Pratyunmis" },
  ],
  creator: "Robolution BIT Mesra",
  publisher: "Birla Institute of Technology, Mesra",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "RoboSaga'26",
    title: "RoboSaga'26 - BIT Mesra's Premier Robotics Festival",
    description:
      "Join RoboSaga'26 at BIT Mesra! Experience HackAway overnight hackathon, robotics workshops, exhibitions, and expert speaker sessions. 23-25 January 2026.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RoboSaga'26 - BIT Mesra Robotics Festival",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RoboSaga'26 - BIT Mesra's Premier Robotics Festival",
    description:
      "Join RoboSaga'26 at BIT Mesra! HackAway hackathon, robotics workshops, exhibitions & speaker sessions. 23-25 January 2026.",
    images: ["/og-image.jpg"],
    creator: "@robolution_bitm",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Technology",
  classification: "Education, Technology, Robotics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} ${rajdhani.variable} ${spaceMono.variable} antialiased isolate`}
      >
        <AuthProvider>
          <QueryProvider>{children}</QueryProvider>
          <Toaster position="top-right" />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
