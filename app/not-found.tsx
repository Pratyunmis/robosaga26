"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-black">
      <div className="max-w-xs w-full flex flex-col items-center">
        <DotLottieReact
          backgroundColor="black"
          src="/lottie/Error404.lottie"
          loop
          autoplay
          style={{ width: 300, height: 300 }}
        />
        <h1 className="text-3xl font-bold text-white mt-4 mb-2 text-center drop-shadow-lg">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-300 mb-6 text-center">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link href="/" passHref>
          <Button variant="pacman" className="text-lg px-8 py-3">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
