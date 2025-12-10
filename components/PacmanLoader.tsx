"use client";

export default function PacmanLoader() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-8 h-8 bg-yellow-400 rounded-full relative animate-bounce">
        <div className="absolute top-0 right-0 w-0 h-0 border-t-16 border-t-transparent border-l-16 border-l-black border-b-16 border-b-transparent"></div>
      </div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
    </div>
  );
}
