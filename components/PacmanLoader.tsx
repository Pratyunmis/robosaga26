"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PacmanLoader = () => {
  return (
    <div className="h-screen w-screen overflow-hidden grid place-items-center">
      <DotLottieReact src="/lottie/PacmanLoading.lottie" loop autoplay />
    </div>
  );
};

export default PacmanLoader;
