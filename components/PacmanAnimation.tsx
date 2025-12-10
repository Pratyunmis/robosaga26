"use client";

import { motion } from "framer-motion";

export default function PacmanAnimation() {
  return (
    <div className="relative w-full h-20 overflow-hidden">
      {/* Pac-Man */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        animate={{
          x: ["0vw", "100vw"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative w-12 h-12">
          <div className="absolute w-12 h-12 bg-yellow-400 rounded-full"></div>
          <motion.div
            className="absolute top-0 right-0 w-0 h-0 border-t-24 border-t-transparent border-l-24 border-l-black border-b-24 border-b-transparent"
            animate={{
              rotate: [0, 20, 0, -20, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      {/* Dots */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-400 rounded-full"
          style={{
            left: `${i * 10 + 5}%`,
          }}
          animate={{
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
