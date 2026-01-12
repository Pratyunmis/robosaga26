"use client";

import { useEffect, useState, useRef, startTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function RouteLoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevPathnameRef = useRef<string>(pathname);
  const prevSearchParamsRef = useRef<string>(searchParams?.toString() || "");

  useEffect(() => {
    const currentSearchParams = searchParams?.toString() || "";

    if (
      prevPathnameRef.current === pathname &&
      prevSearchParamsRef.current === currentSearchParams
    ) {
      return;
    }

    prevPathnameRef.current = pathname;
    prevSearchParamsRef.current = currentSearchParams;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (completeTimeoutRef.current) {
      clearTimeout(completeTimeoutRef.current);
    }

    startTransition(() => {
      setLoading(true);
      setProgress(20);
    });

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          return 90;
        }
        return prev + Math.random() * 15 + 15;
      });
    }, 100);

    completeTimeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setProgress(0);
        }, 150);
      }, 150);
    }, 400);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (completeTimeoutRef.current) {
        clearTimeout(completeTimeoutRef.current);
      }
    };
  }, [pathname, searchParams]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 w-screen h-1 bg-transparent pointer-events-none z-[9999]"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-linear-to-r from-primary via-primary/90 to-primary transition-all duration-200 ease-out shadow-lg shadow-primary/50"
        style={{
          width: `${Math.min(progress, 100)}%`,
          opacity: loading ? 1 : 0,
        }}
      />
    </div>
  );
}
