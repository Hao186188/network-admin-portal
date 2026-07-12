// src/app/(routes)/lectures/components/LectureHero.tsx
// LECTURE HERO - FIX LỖI

"use client";

import { ShinyText } from "@/components/ui/ShinyText";
import { Button } from "@/components/ui/button";
import { useLectures } from "@/hooks/useLectures";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Play, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function LectureHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { lectures, isLoading } = useLectures();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsVideoLoaded(true);
      video.play();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    return () => video.removeEventListener("loadeddata", handleLoadedData);
  }, []);

  // ✅ Thêm type cho parameter
  const totalLectures = lectures?.length || 0;
  const totalVideos =
    lectures?.filter((l: any) => l.type === "video").length || 0;
  const totalSlides =
    lectures?.filter((l: any) => l.type === "slide").length || 0;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          style={{
            opacity: isVideoLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 md:h-20" />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12"
        >
          <div className="flex items-center gap-3 text-white/80 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="text-sm sm:text-base">
              <strong className="text-white">{totalLectures}</strong> Bài giảng
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/80 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5">
            <Play className="w-5 h-5 text-primary" />
            <span className="text-sm sm:text-base">
              <strong className="text-white">{totalVideos}</strong> Video bài
              giảng
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/80 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/5">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm sm:text-base">
              <strong className="text-white">{totalSlides}</strong> Slide & tài
              liệu
            </span>
          </div>
        </motion.div>

        {/* Hero Center */}
        <div className="flex-1 flex flex-col justify-center -mt-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-primary text-xs sm:text-sm uppercase tracking-wider mb-4 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Kho bài giảng Quản trị Mạng 3
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="space-y-0"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter leading-[0.85] text-white">
              Học tập
            </h1>
            <ShinyText
              text="không giới hạn."
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter leading-[0.85]"
              baseColor="#3b82f6"
              shineColor="#60a5fa"
              speed={3}
              spread={100}
              as="h1"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            className="text-white/60 text-sm sm:text-base max-w-xl mt-4 leading-relaxed"
          >
            Video bài giảng, slide và tài liệu học tập được cập nhật liên tục,
            giúp bạn nắm vững kiến thức Quản trị Mạng một cách dễ dàng.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Button
              className="group rounded-full bg-primary text-white hover:bg-primary/90 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base transition-all duration-300 shadow-lg shadow-primary/20"
              onClick={() => {
                document.getElementById("lecture-grid")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Khám phá bài giảng
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/40 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base transition-all duration-300"
            >
              Xem tất cả
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
