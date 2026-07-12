// src/components/ui/VideoSection.tsx
// VIDEO SECTION - GIẢM OVERLAY

"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useVideo } from "./VideoManager";

interface VideoSectionProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  overlayOpacity?: number;
  section?:
    "hero" | "stats" | "projects" | "journal" | "explorations" | "footer";
}

export function VideoSection({
  children,
  className,
  opacity,
  overlayOpacity = 40, // ✅ Giảm từ 85 xuống 40
  section = "stats",
}: VideoSectionProps) {
  const { setOpacity, play, isReady } = useVideo();

  useEffect(() => {
    const configs = {
      hero: 1,
      stats: 0.5, // ✅ Tăng opacity cho stats
      projects: 0.4, // ✅ Tăng opacity cho projects
      journal: 0.35, // ✅ Tăng opacity cho journal
      explorations: 0.4, // ✅ Tăng opacity cho explorations
      footer: 0.4, // ✅ Tăng opacity cho footer
    };
    const newOpacity = opacity ?? configs[section] ?? 0.5;
    setOpacity(newOpacity);

    if (isReady) {
      play();
    }
  }, [section, opacity, setOpacity, play, isReady]);

  return (
    <div className={cn("relative z-10", className)}>
      {/* Overlay nhẹ hơn nhiều */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: `rgba(0,0,0,${(100 - overlayOpacity) / 100})`,
        }}
      />
      {children}
    </div>
  );
}
