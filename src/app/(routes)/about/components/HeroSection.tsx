// src/app/(routes)/about/components/HeroSection.tsx
// HERO SECTION - SÁNG HƠN

"use client";

import { useVideo } from "@/components/ui/VideoManager";
import { VideoSection } from "@/components/ui/VideoSection";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface HeroSectionProps {
  nameRef: React.RefObject<HTMLHeadingElement | null>;
  blurElementsRef: React.MutableRefObject<
    (HTMLParagraphElement | HTMLDivElement)[]
  >;
}

export function HeroSection({ nameRef, blurElementsRef }: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Developer", "Designer", "Creator", "Builder"];
  const heroRef = useRef<HTMLDivElement>(null);
  const { play, isReady } = useVideo();

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [roles.length]);

  useEffect(() => {
    if (isReady) {
      play();
    }
  }, [isReady, play]);

  return (
    <VideoSection
      section="hero"
      overlayOpacity={30}
      className="min-h-[85vh] md:min-h-screen w-full flex flex-col justify-between"
    >
      <section
        ref={heroRef}
        className="relative min-h-[85vh] md:min-h-screen w-full flex flex-col justify-between overflow-hidden text-white"
      >
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center w-full max-w-5xl mx-auto px-4 pt-32 pb-16 text-center">
          <div className="mb-6 rounded-full px-4 py-1.5 bg-cyan-500/20 border border-cyan-500/40 backdrop-blur-sm animate-fade-in">
            <span className="text-xs font-medium text-cyan-300 uppercase tracking-widest">
              Học tập &amp; Tương tác
            </span>
          </div>

          <h1
            ref={nameRef}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90 max-w-3xl leading-tight drop-shadow-2xl"
          >
            Hợp tác cùng <span className="text-cyan-300">giảng viên</span> và{" "}
            <span className="text-purple-300">sinh viên</span>
          </h1>

          <p
            ref={(el) => {
              if (el) blurElementsRef.current.push(el);
            }}
            className="mt-6 text-base md:text-lg text-white/80 max-w-2xl font-light leading-relaxed drop-shadow-lg"
          >
            Nền tảng chia sẻ tài liệu, quản lý lab Cisco, Docker trực quan dành
            riêng cho lớp Quản trị Mạng 3.
          </p>

          <div
            ref={(el) => {
              if (el) blurElementsRef.current.push(el);
            }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <a href="#work">
              <Button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-medium rounded-xl shadow-lg shadow-cyan-500/30 active:scale-95 transition-all text-white">
                Khám phá ngay
              </Button>
            </a>
            <a href="/documents">
              <Button
                variant="outline"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 font-medium rounded-xl active:scale-95 transition-all backdrop-blur-sm text-white"
              >
                Xem tài liệu
              </Button>
            </a>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-xs text-white/60 uppercase tracking-[0.2em]">
              SCROLL
            </span>
            <div className="w-px h-10 bg-white/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-scroll-down" />
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full pb-12 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-slate-950/50 to-transparent">
          <div className="flex items-center gap-4 md:gap-8 text-sm font-semibold tracking-wider text-white/50 flex-wrap justify-center">
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">
              KHOA CNTT
            </span>
            <span className="text-white/20">•</span>
            <span className="hover:text-purple-400 transition-colors cursor-pointer">
              MẠNG 3
            </span>
            <span className="text-white/20">•</span>
            <span className="hover:text-cyan-400 transition-colors cursor-pointer">
              CISCO LAB
            </span>
          </div>
        </div>
      </section>
    </VideoSection>
  );
}
