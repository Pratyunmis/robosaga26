import { signIn, auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Suspense } from "react";
import { connection } from "next/server";

async function LoginContent() {
  await connection();
  const session = await auth();

  if (session) {
    // If user doesn't have rollNo, redirect to onboarding
    if (!session.user?.rollNo) {
      redirect("/onboarding");
    }
    redirect("/");
  }
  return null;
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={null}>
        <LoginContent />
      </Suspense>
      <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
        {/* Animated Pac-Man dots background */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-8 p-8 h-full">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating ghosts */}
        <div
          className="absolute top-20 left-10 animate-bounce"
          style={{ animationDuration: "3s" }}
        >
          <div className="text-6xl">
            <Image
              src="/svg/pacman-svgrepo-com.svg"
              alt="pacman"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div
          className="absolute bottom-20 right-10 animate-bounce"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
        >
          <div className="text-6xl">
            <Image
              src="/svg/pacman-svgrepo-com.svg"
              alt="pacman"
              width={48}
              height={48}
            />
          </div>
        </div>
        <div
          className="absolute top-40 right-20 animate-bounce"
          style={{ animationDuration: "3.5s", animationDelay: "1s" }}
        >
          <div className="text-5xl">
            <Image
              src="/svg/pacman-svgrepo-com.svg"
              alt="pacman"
              width={48}
              height={48}
            />
          </div>
        </div>

        {/* Main login card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-blue-950 border-4 border-yellow-400 rounded-3xl shadow-2xl shadow-yellow-400/50 p-8 relative overflow-hidden">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-yellow-400 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-yellow-400 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-yellow-400 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-yellow-400 rounded-br-3xl" />

            {/* RoboSaga Logo */}
            <div className="flex justify-center mb-8 -mt-2">
              <div className="relative">
                <Image
                  src="/svg/robosaga.svg"
                  alt="RoboSaga '26 Logo"
                  loading="eager"
                  width={280}
                  height={100}
                  className="h-20 w-auto"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-center mb-2 text-yellow-400 font-mono tracking-wider">
              READY!
            </h1>
            <p className="text-center text-blue-300 mb-8 font-mono text-sm">
              PLAYER 1 - PRESS START
            </p>

            {/* Score display */}
            <div className="flex justify-between mb-8 px-4">
              <div className="text-yellow-400 font-mono">
                <div className="text-xs text-blue-300">1UP</div>
                <div className="text-xl">00</div>
              </div>
              <div className="text-yellow-400 font-mono">
                <div className="text-xs text-blue-300">HIGH SCORE</div>
                <div className="text-xl">999999</div>
              </div>
            </div>

            {/* Login buttons */}
            <div className="space-y-4">
              <form
                action={async () => {
                  "use server";
                  await signIn("github", { redirectTo: "/onboarding" });
                }}
              >
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl border-4 border-yellow-400 shadow-lg shadow-purple-500/50 transition-all duration-400 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/70 font-mono text-lg flex items-center justify-center gap-3 group"
                >
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>CONTINUE WITH GITHUB</span>
                </button>
              </form>

              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/onboarding" });
                }}
              >
                <button
                  type="submit"
                  className="w-full cursor-pointer bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl border-4 border-yellow-400 shadow-lg shadow-red-500/50 transition-all duration-400 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/70 font-mono text-lg flex items-center justify-center gap-3 group"
                >
                  <svg
                    className="w-6 h-6 group-hover:rotate-12 transition-transform"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>
              </form>
            </div>

            {/* Footer text */}
            <div className="mt-8 text-center">
              <p className="text-blue-300 text-xs font-mono">
                © 2026 Robolution,BIT Mesra. All rights reserved.
              </p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="text-yellow-400 text-xl">●</span>
                <span className="text-yellow-400 text-xl">●</span>
                <span className="text-yellow-400 text-xl">●</span>
              </div>
            </div>
          </div>

          {/* Power pellet animation */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
          </div>
        </div>
      </div>
    </>
  );
}
