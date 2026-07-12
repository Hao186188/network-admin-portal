// src/components/ui/ShinyText.tsx
// SHINY TEXT COMPONENT - FIXED

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ShinyTextProps {
  text: string;
  className?: string;
  baseColor?: string;
  shineColor?: string;
  speed?: number;
  spread?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
}

export function ShinyText({
  text,
  className,
  baseColor = "#64CEFB",
  shineColor = "#ffffff",
  speed = 3,
  spread = 100,
  as: Component = "span",
}: ShinyTextProps) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Component
        className={cn("relative inline-block font-medium", className)}
        style={{
          background: `linear-gradient(
            100deg,
            ${baseColor} 0%,
            ${shineColor} 50%,
            ${baseColor} 100%
          )`,
          backgroundSize: `${spread * 2}% 100%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {text}
        <motion.span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(
              100deg,
              transparent 0%,
              ${shineColor} 30%,
              ${shineColor} 50%,
              ${shineColor} 70%,
              transparent 100%
            )`,
            backgroundSize: `${spread * 2}% 100%`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "200% 0%"],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </Component>
    </motion.div>
  );
}
