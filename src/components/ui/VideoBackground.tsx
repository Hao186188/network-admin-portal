// src/components/ui/VideoBackground.tsx
// COMPONENT VIDEO BACKGROUND TẬP TRUNG

"use client";

import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  opacity?: number;
  overlayOpacity?: number;
  overlayColor?: string;
  videoSrc?: string;
  position?: "cover" | "contain";
}

export function VideoBackground({
  className,
  children,
  opacity = 0.2,
  overlayOpacity = 85,
  overlayColor = "bg-bg",
  videoSrc = "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
  position = "cover",
}: VideoBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="relative w-full h-full">
          <video
            className={cn(
              "w-full h-full",
              position === "cover" ? "object-cover" : "object-contain",
            )}
            style={{ opacity }}
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Overlay Layer */}
      <div
        className={cn(
          "absolute inset-0 z-[1] pointer-events-none",
          overlayColor,
        )}
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
