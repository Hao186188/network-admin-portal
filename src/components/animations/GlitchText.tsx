// src/components/animations/GlitchText.tsx
// Hiệu ứng nhiễu sóng kỹ thuật số

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

interface GlitchTextProps {
  children: React.ReactNode;
  className?: string;
  glitchIntensity?: number;
}

export function GlitchText({
  children,
  className = "",
  glitchIntensity = 2,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <motion.span
      className={cn("relative inline-block", className)}
      onHoverStart={() => setIsGlitching(true)}
      onHoverEnd={() => setIsGlitching(false)}
      animate={
        isGlitching
          ? {
              x: [0, -glitchIntensity, glitchIntensity, -glitchIntensity, 0],
              y: [0, glitchIntensity, -glitchIntensity, glitchIntensity, 0],
              transition: { duration: 0.2, repeat: 3 },
            }
          : {}
      }
    >
      {children}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500 opacity-70"
            animate={{
              x: [2, -2, 4, -4, 0],
              y: [-1, 1, -2, 2, 0],
              opacity: [0.7, 0.3, 0.7, 0.3, 0],
            }}
            transition={{ duration: 0.15, repeat: 3 }}
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-blue-500 opacity-70"
            animate={{
              x: [-2, 2, -4, 4, 0],
              y: [1, -1, 2, -2, 0],
              opacity: [0.7, 0.3, 0.7, 0.3, 0],
            }}
            transition={{ duration: 0.15, repeat: 3, delay: 0.05 }}
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.span>
  );
}
