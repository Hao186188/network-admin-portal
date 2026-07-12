// src/components/animations/TerminalTyping.tsx
// HOÀN CHỈNH

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TerminalTypingProps {
  text: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TerminalTyping({
  text,
  className = "",
  speed = 50,
  showCursor = true,
  onComplete,
}: TerminalTypingProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-4 bg-cyan-400 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}
