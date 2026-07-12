// src/app/(routes)/about/components/StatsSection.tsx
// STATS SECTION - SÁNG HƠN

"use client";

import { VideoSection } from "@/components/ui/VideoSection";
import { StatData } from "../types";

interface StatsSectionProps {
  stats: StatData[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <VideoSection section="stats" overlayOpacity={50} className="py-8 md:py-12">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {stats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={i}
                className="stat-item relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/70 p-4 sm:p-5 backdrop-blur-md group hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-2 h-[1px] bg-cyan-500/60" />
                <div className="absolute top-0 left-0 w-[1px] h-2 bg-cyan-500/60" />

                <div className="flex justify-between items-start mb-2 sm:mb-3">
                  <span className="text-[8px] sm:text-[10px] font-mono tracking-wider text-white/50 uppercase">
                    {stat.label}
                  </span>
                  <IconComponent
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`}
                  />
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-mono">
                    {stat.value}
                  </span>
                </div>

                <p className="text-[9px] sm:text-[11px] text-white/40 font-mono mt-1">
                  &gt; {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </VideoSection>
  );
}
