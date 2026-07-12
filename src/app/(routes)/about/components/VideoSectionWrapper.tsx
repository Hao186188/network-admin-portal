// src/app/(routes)/about/components/VideoSectionWrapper.tsx
// WRAPPER TÁI SỬ DỤNG CHO TẤT CẢ SECTION

"use client";

import { VideoBackground } from "@/components/ui/VideoBackground";
import { cn } from "@/lib/utils";

interface VideoSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  opacity?: number;
  overlayOpacity?: number;
  section?:
    "hero" | "stats" | "projects" | "journal" | "explorations" | "footer";
}

export function VideoSectionWrapper({
  children,
  className,
  opacity = 0.2,
  overlayOpacity = 85,
  section = "stats",
}: VideoSectionWrapperProps) {
  // Cấu hình cho từng section
  const configs = {
    hero: { opacity: 1, overlay: 80 },
    stats: { opacity: 0.3, overlay: 85 },
    projects: { opacity: 0.2, overlay: 90 },
    journal: { opacity: 0.15, overlay: 85 },
    explorations: { opacity: 0.2, overlay: 90 },
    footer: { opacity: 0.2, overlay: 90 },
  };

  const config = configs[section] || configs.stats;

  return (
    <VideoBackground
      className={cn("relative w-full", className)}
      opacity={opacity || config.opacity}
      overlayColor="bg-bg"
      overlayOpacity={overlayOpacity || config.overlay}
      videoSrc="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4"
    >
      {children}
    </VideoBackground>
  );
}
