// src/app/(routes)/documents/components/DocumentsHero.tsx
// HERO SECTION - HOÀN CHỈNH

"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Play, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ============================================
// FADING VIDEO COMPONENT
// ============================================

function FadingVideo({
  src,
  className = "",
  style = {},
}: {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);
  const currentOpacityRef = useRef(0);

  const fadeTo = (target: number, duration: number) => {
    if (!videoRef.current) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const startOpacity = currentOpacityRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startOpacity + (target - startOpacity) * eased;

      if (videoRef.current) {
        videoRef.current.style.opacity = String(current);
        currentOpacityRef.current = current;
      }

      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(animate);
      } else {
        rafIdRef.current = null;
        if (videoRef.current) {
          videoRef.current.style.opacity = String(target);
          currentOpacityRef.current = target;
        }
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      video.style.opacity = "0";
      currentOpacityRef.current = 0;
      video.play();
      fadeTo(1, 500);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (!fadingOutRef.current && remaining <= 0.55 && remaining > 0) {
        fadingOutRef.current = true;
        fadeTo(0, 500);
      }
    };

    const handleEnded = () => {
      video.style.opacity = "0";
      currentOpacityRef.current = 0;
      fadingOutRef.current = false;
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
        fadeTo(1, 500);
      }, 100);
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}

// ============================================
// BLUR TEXT COMPONENT
// ============================================

function BlurText({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <p className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-4xl md:text-6xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl tracking-[-4px]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          whileInView={{
            filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
            opacity: [0, 0.5, 1],
            y: [50, -5, 0],
          }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: 0.7,
            delay: i * 0.1,
            times: [0, 0.5, 1],
            ease: "easeOut",
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ============================================
// MAIN HERO COMPONENT
// ============================================

interface DocumentsHeroProps {
  onUploadClick?: () => void;
  stats?: {
    total: number;
    downloads: number;
    views: number;
    recent_uploads: number;
    total_size: string;
  };
}

export function DocumentsHero({ onUploadClick, stats }: DocumentsHeroProps) {
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 1300);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    const contentSection = document.getElementById("documents-content");
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleIntro = () => {
    window.open("/about", "_blank");
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black pb-8 md:pb-12 lg:pb-16">
      {/* Background Video */}
      <FadingVideo
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: "120%", height: "120%" }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Spacer for navbar */}
        <div className="h-20 md:h-24" />

        {/* Hero Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pt-8 md:pt-0">
          {/* Badge */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="liquid-glass rounded-full px-1 py-1 inline-flex items-center gap-2"
          >
            <span className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full">
              Thư viện
            </span>
            <span className="text-sm text-white/90 pr-3 font-body">
              Kho tài liệu học tập Quản trị Mạng 3
            </span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="mt-4"
          >
            <BlurText text="Khám Phá Kho Tri Thức Mạng" />
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="text-sm md:text-base text-white/80 max-w-2xl text-center font-body font-light leading-relaxed mt-4"
          >
            Tài liệu học tập, bài giảng, giáo trình và hướng dẫn thực hành dành
            cho sinh viên Quản trị Mạng 3. Cập nhật liên tục từ giảng viên và
            cộng đồng.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-6"
          >
            <button
              onClick={handleExplore}
              className="liquid-glass-strong rounded-full px-5 md:px-6 py-2.5 md:py-3 text-sm font-medium text-white flex items-center gap-2 hover:scale-105 transition-transform"
            >
              Khám phá ngay
              <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <button
              onClick={handleIntro}
              className="text-white/70 hover:text-white transition-colors text-sm font-body flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-white/70" />
              Xem giới thiệu
            </button>
            {onUploadClick && (
              <button
                onClick={onUploadClick}
                className="liquid-glass rounded-full px-5 md:px-6 py-2.5 md:py-3 text-sm font-medium text-white flex items-center gap-2 hover:border-cyan-500/50 transition-all border border-white/10"
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Đăng tài liệu</span>
                <span className="sm:hidden">Đăng</span>
              </button>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
            animate={{
              filter: "blur(0px)",
              opacity: showStats ? 1 : 0,
              y: showStats ? 0 : 20,
            }}
            transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-6 md:mt-8"
          >
            <div className="liquid-glass p-3 md:p-4 rounded-[1.25rem] flex flex-col items-center min-w-[70px] md:min-w-[100px]">
              <span className="text-xl md:text-3xl font-heading italic text-white tracking-[-1px] leading-none">
                {stats?.total || 0}
              </span>
              <span className="text-[8px] md:text-[10px] text-white/60 font-body font-light mt-1">
                Tài liệu
              </span>
            </div>
            <div className="liquid-glass p-3 md:p-4 rounded-[1.25rem] flex flex-col items-center min-w-[70px] md:min-w-[100px]">
              <span className="text-xl md:text-3xl font-heading italic text-white tracking-[-1px] leading-none">
                {stats?.downloads || 0}
              </span>
              <span className="text-[8px] md:text-[10px] text-white/60 font-body font-light mt-1">
                Lượt tải
              </span>
            </div>
            <div className="liquid-glass p-3 md:p-4 rounded-[1.25rem] flex flex-col items-center min-w-[70px] md:min-w-[100px]">
              <span className="text-xl md:text-3xl font-heading italic text-white tracking-[-1px] leading-none">
                {stats?.views || 0}
              </span>
              <span className="text-[8px] md:text-[10px] text-white/60 font-body font-light mt-1">
                Lượt xem
              </span>
            </div>
            <div className="liquid-glass p-3 md:p-4 rounded-[1.25rem] flex flex-col items-center min-w-[70px] md:min-w-[100px]">
              <span className="text-xl md:text-3xl font-heading italic text-white tracking-[-1px] leading-none">
                {stats?.total_size || "0 MB"}
              </span>
              <span className="text-[8px] md:text-[10px] text-white/60 font-body font-light mt-1">
                Dung lượng
              </span>
            </div>
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 md:gap-4 pb-6 md:pb-8"
        >
          <div className="liquid-glass rounded-full px-3 md:px-4 py-1 md:py-1.5">
            <span className="text-[10px] md:text-xs font-medium text-white/80">
              Hợp tác cùng giảng viên và sinh viên
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-10 font-heading italic text-white text-base md:text-xl tracking-tight flex-wrap justify-center">
            <span>Khoa CNTT</span>
            <span className="text-white/20">·</span>
            <span>Mạng 3</span>
            <span className="text-white/20">·</span>
            <span>Cisco</span>
            <span className="text-white/20">·</span>
            <span>Linux</span>
            <span className="text-white/20">·</span>
            <span>Network</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
