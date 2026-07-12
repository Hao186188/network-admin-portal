// src/app/(routes)/about/components/ExplorationsSection.tsx
// EXPLORATIONS SECTION - HOÀN CHỈNH

"use client";

import { Exploration } from "../types";

interface ExplorationsSectionProps {
  explorations: Exploration[];
  leftColumnRef: React.RefObject<HTMLDivElement | null>;
  rightColumnRef: React.RefObject<HTMLDivElement | null>;
  explorationsRef: React.RefObject<HTMLDivElement | null>;
}

export function ExplorationsSection({
  explorations,
  leftColumnRef,
  rightColumnRef,
  explorationsRef,
}: ExplorationsSectionProps) {
  return (
    <section ref={explorationsRef} className="relative min-h-[300vh] bg-bg">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="relative w-full h-full">
            <video
              className="w-full h-full object-cover opacity-20"
              autoPlay
              muted
              loop
              playsInline
            >
              <source
                src="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="absolute inset-0 bg-black/90" />
        </div>

        {/* Tech Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
          <div className="w-full h-full bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-bg" />
        </div>

        {/* Matrix Rain Effect */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="font-mono text-xs text-cyan-500/30 whitespace-nowrap animate-matrix">
            {Array.from({ length: 50 }).map((_, i) => (
              <span key={i} className="inline-block mx-1">
                {String.fromCharCode(0x30a0 + Math.random() * 96)}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-8 h-px bg-cyan-500/50" />
            <span className="text-xs text-cyan-400 uppercase tracking-[0.3em] font-mono">
              // EXPLORATIONS
            </span>
            <div className="w-8 h-px bg-cyan-500/50" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display italic text-white">
            Visual <span className="text-cyan-400">playground</span>
          </h2>
          <p className="text-white/40 text-xs sm:text-sm mt-2 font-mono">
            Thử nghiệm và sáng tạo không giới hạn
          </p>

          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[8px] sm:text-[10px] text-white/30 font-mono tracking-widest">
              SYSTEM ACTIVE • v2.0.1
            </span>
          </div>
        </div>

        {/* Parallax Columns */}
        <div className="absolute inset-0 z-0 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-40 h-full items-center">
            <div ref={leftColumnRef} className="space-y-8 sm:space-y-12">
              {explorations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="explore-item relative group overflow-hidden bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-6 max-w-[280px] sm:max-w-[320px] aspect-square flex flex-col items-start justify-between backdrop-blur-md transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8px] sm:text-[10px] font-mono tracking-widest text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
                      // {item.code}
                    </span>
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`}
                    />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/20 group-hover:text-cyan-400 transition-all duration-500 group-hover:scale-110" />
                    <span className="text-white/80 group-hover:text-white font-display italic text-lg sm:text-2xl tracking-wide transition-colors mt-2 text-center">
                      {item.title}
                    </span>
                  </div>

                  <div className="w-full pt-2 sm:pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[8px] sm:text-[10px] text-white/30 font-mono">
                      STATUS:{" "}
                      <span className="text-cyan-400">{item.status}</span>
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-white/20 group-hover:text-cyan-400 transition-colors font-mono">
                      ▶ ACCESS_
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={rightColumnRef}
              className="space-y-8 sm:space-y-12 mt-20 sm:mt-40"
            >
              {explorations.slice(3).map((item) => (
                <div
                  key={item.id}
                  className="explore-item relative group overflow-hidden bg-slate-950/40 border border-white/5 rounded-2xl p-4 sm:p-6 max-w-[280px] sm:max-w-[320px] aspect-square flex flex-col items-start justify-between backdrop-blur-md transition-all duration-500 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] cursor-pointer"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />

                  <div className="flex justify-between w-full items-center">
                    <span className="text-[8px] sm:text-[10px] font-mono tracking-widest text-purple-500/60 group-hover:text-purple-400 transition-colors">
                      // {item.code}
                    </span>
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse`}
                    />
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/20 group-hover:text-purple-400 transition-all duration-500 group-hover:scale-110" />
                    <span className="text-white/80 group-hover:text-white font-display italic text-lg sm:text-2xl tracking-wide transition-colors mt-2 text-center">
                      {item.title}
                    </span>
                  </div>

                  <div className="w-full pt-2 sm:pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[8px] sm:text-[10px] text-white/30 font-mono">
                      STATUS:{" "}
                      <span className="text-purple-400">{item.status}</span>
                    </span>
                    <span className="text-[8px] sm:text-[10px] text-white/20 group-hover:text-purple-400 transition-colors font-mono">
                      ▶ ACCESS_
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
