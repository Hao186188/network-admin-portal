// src/app/(routes)/about/components/LoadingScreen.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 2700;
    const wordSwitchInterval = 900;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      const newCount = Math.min(100, Math.floor(progress * 100));
      setCount(newCount);

      const newWordIndex =
        Math.floor((timestamp - startTime) / wordSwitchInterval) % words.length;
      setWordIndex(newWordIndex);

      if (newCount < 100) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setTimeout(onComplete, 400);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [onComplete, words.length]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col items-center justify-center">
      <div className="absolute top-8 left-8">
        <span className="text-xs text-muted uppercase tracking-[0.3em] animate-[fadeIn_0.6s_ease-out]">
          Portfolio
        </span>
      </div>

      <div className="flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 right-8">
        <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums">
          {String(count).padStart(3, "0")}
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-stroke/50">
        <div
          className="h-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] transition-transform duration-300"
          style={{
            transform: `scaleX(${count / 100})`,
            transformOrigin: "left",
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
        />
      </div>
    </div>
  );
}
