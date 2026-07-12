// src/app/(routes)/about/components/JournalSection.tsx
// JOURNAL SECTION - HOÀN CHỈNH

"use client";

import { VideoSection } from "@/components/ui/VideoSection";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { JournalEntry } from "../types";

interface JournalSectionProps {
  entries: JournalEntry[];
}

export function JournalSection({ entries }: JournalSectionProps) {
  return (
    <VideoSection section="journal" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-8 sm:mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Nhật ký
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display italic">
              Bài viết <span className="not-italic">gần đây</span>
            </h2>
            <p className="text-muted text-xs sm:text-sm mt-2">
              Chia sẻ kiến thức và kinh nghiệm
            </p>
          </div>
          <a
            href="#"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted hover:text-text-primary hover:ring-2 hover:ring-[#89AACC] transition-all"
          >
            Xem tất cả <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="journal-entry flex items-center gap-4 sm:gap-6 p-3 sm:p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[30px] sm:rounded-full transition-all group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex-shrink-0 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-primary-500/30 to-secondary-500/30 flex items-center justify-center text-xl sm:text-2xl">
                  📝
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-medium group-hover:text-primary-400 transition-colors line-clamp-1">
                  {entry.title}
                </h4>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted">
                  <span>{entry.date}</span>
                  <span>•</span>
                  <span>{entry.readTime}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted group-hover:text-text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </VideoSection>
  );
}
