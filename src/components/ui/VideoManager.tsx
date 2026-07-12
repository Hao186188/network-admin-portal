// src/components/ui/VideoManager.tsx
// VIDEO MANAGER - TĂNG ĐỘ SÁNG

"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

interface VideoContextType {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  play: () => void;
  pause: () => void;
  setOpacity: (opacity: number) => void;
  opacity: number;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideo() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within VideoProvider");
  }
  return context;
}

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [opacity, setOpacity] = useState(1); // ✅ Tăng opacity mặc định lên 1

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      console.log("✅ Video loaded successfully");
      setIsReady(true);
      video.play().catch((err) => {
        console.warn("⚠️ Auto-play prevented:", err);
      });
    };

    const handleCanPlay = () => {
      console.log("✅ Video can play");
      video.play().catch((err) => {
        console.warn("⚠️ Auto-play prevented:", err);
      });
    };

    const handleError = (e: any) => {
      console.error("❌ Video error:", e);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    video.load();

    setTimeout(() => {
      video.play().catch((err) => {
        console.warn("⚠️ Auto-play prevented (timeout):", err);
      });
    }, 500);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, []);

  const play = () => {
    videoRef.current?.play().catch((err) => {
      console.warn("⚠️ Play prevented:", err);
    });
  };

  const pause = () => {
    videoRef.current?.pause();
  };

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        isReady,
        play,
        pause,
        setOpacity,
        opacity,
      }}
    >
      {/* Video element - Fixed position với opacity cao */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{
            opacity: 1, // ✅ Luôn giữ opacity = 1
            filter: "brightness(1.1) contrast(1.05)", // ✅ Tăng độ sáng và tương phản
          }}
          muted
          loop
          playsInline
          preload="auto"
        >
          <source
            src="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Overlay nhẹ hơn - chỉ 50% thay vì 70% */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-black/50" />

      {children}
    </VideoContext.Provider>
  );
}
