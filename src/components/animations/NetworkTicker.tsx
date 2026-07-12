// src/components/animations/NetworkTicker.tsx
// HOÀN CHỈNH

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface NetworkTickerProps {
  messages: string[];
  className?: string;
  speed?: number;
}

export function NetworkTicker({
  messages,
  className = "",
  speed = 30,
}: NetworkTickerProps) {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = messages.indexOf(currentMessage);
      const nextIndex = (currentIndex + 1) % messages.length;
      setCurrentMessage(messages[nextIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentMessage, messages]);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden py-2">
        <motion.div
          animate={{
            x: isHovered ? 0 : ["100%", "-100%"],
          }}
          transition={{
            duration: isHovered ? 0 : speed,
            repeat: isHovered ? 0 : Infinity,
            ease: "linear",
          }}
          className="whitespace-nowrap"
        >
          <span className="inline-block px-4 text-sm font-mono text-cyan-300">
            {currentMessage}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
