// src/components/chat/TypingIndicator.tsx
// Vai trò: Hiển thị đang nhập

"use client";

import { motion } from "framer-motion";

interface TypingIndicatorProps {
  name?: string;
}

export function TypingIndicator({ name }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-muted-foreground/60 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {name ? `${name} đang nhập...` : "Đang nhập..."}
      </span>
    </div>
  );
}
