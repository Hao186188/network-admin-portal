// src/app/(routes)/announcements/components/AnnouncementTicker.tsx
// Vai trò: Dải chữ chạy vô tận - FIXED

"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnnouncementTickerProps {
  announcements: Array<{ id: string; title: string; priority: string }>;
}

export function AnnouncementTicker({ announcements }: AnnouncementTickerProps) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [duplicateCount, setDuplicateCount] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth;
      const viewportWidth = window.innerWidth;
      const needed = Math.ceil(viewportWidth / width) + 1;
      setDuplicateCount(Math.max(needed, 2));
    }
  }, [announcements]);

  if (announcements.length === 0) return null;

  const urgentAnnouncements = announcements
    .filter((a) => a.priority === "high")
    .slice(0, 5);

  const items =
    urgentAnnouncements.length > 0
      ? urgentAnnouncements
      : announcements.slice(0, 5);

  const tickerItems = Array(duplicateCount).fill(items).flat();

  return (
    <div
      className="relative overflow-hidden bg-slate-950/80 border-y border-cyan-500/10 py-2"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent" />

      <motion.div
        ref={containerRef}
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -100 * (items.length / tickerItems.length)],
        }}
        transition={{
          duration: 30 * (items.length / 5),
          repeat: Infinity,
          ease: "linear",
          // ✅ SỬA: dùng repeatDelay thay vì pause
          repeatDelay: 0,
        }}
      >
        {tickerItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex items-center gap-4 mx-8 text-sm font-mono"
          >
            <span className="text-cyan-400">▶</span>
            <span className="text-slate-300">{item.title}</span>
            <span className="text-cyan-500/50">•</span>
            <span className="text-xs text-cyan-400/60">
              {item.priority === "high" ? "⚠️ URGENT" : "INFO"}
            </span>
            <span className="text-cyan-500/30">|</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
