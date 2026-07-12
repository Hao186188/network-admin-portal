// src/hooks/useVideoBackground.ts
// HOOK QUẢN LÝ VIDEO BACKGROUND

"use client";

import { useEffect, useState } from "react";

interface VideoConfig {
  src: string;
  opacity: number;
  overlayOpacity: number;
}

const defaultConfig: VideoConfig = {
  src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
  opacity: 1,
  overlayOpacity: 70,
};

// Cấu hình cho từng section
const sectionConfigs = {
  hero: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 1,
    overlayOpacity: 80,
  },
  stats: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 0.3,
    overlayOpacity: 85,
  },
  projects: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 0.2,
    overlayOpacity: 90,
  },
  journal: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 0.15,
    overlayOpacity: 85,
  },
  explorations: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 0.2,
    overlayOpacity: 90,
  },
  footer: {
    src: "https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4",
    opacity: 0.2,
    overlayOpacity: 90,
  },
};

export function useVideoBackground(
  section: keyof typeof sectionConfigs = "hero",
) {
  const [config, setConfig] = useState<VideoConfig>(defaultConfig);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const sectionConfig = sectionConfigs[section] || defaultConfig;
    setConfig(sectionConfig);

    // Preload video
    const video = document.createElement("video");
    video.src = sectionConfig.src;
    video.onloadeddata = () => setIsLoaded(true);
    video.load();
  }, [section]);

  return {
    ...config,
    isLoaded,
    // Helper để tạo class cho overlay
    getOverlayClass: (bgColor = "bg-black") => {
      return `${bgColor}/${Math.round((config.overlayOpacity * 100) / 100)}`;
    },
  };
}
