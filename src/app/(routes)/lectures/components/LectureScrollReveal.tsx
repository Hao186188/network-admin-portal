// src/app/(routes)/lectures/components/LectureScrollReveal.tsx
// SCROLL REVEAL - HOÀN CHỈNH

"use client";

import { cn } from "@/lib/utils";
import { Lecture } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { LectureCard } from "./LectureCard";

interface LectureScrollRevealProps {
  lectures: Lecture[];
  onLike: (id: string) => void;
  likedIds: string[];
  viewMode: "grid" | "list";
}

export function LectureScrollReveal({
  lectures,
  onLike,
  likedIds,
  viewMode,
}: LectureScrollRevealProps) {
  return (
    <div className="space-y-12 md:space-y-16">
      {lectures.map((lecture, index) => (
        <ScrollRevealItem
          key={lecture.id}
          lecture={lecture}
          index={index}
          onLike={onLike}
          isLiked={likedIds.includes(lecture.id)}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
}

interface ScrollRevealItemProps {
  lecture: Lecture;
  index: number;
  onLike: (id: string) => void;
  isLiked: boolean;
  viewMode: "grid" | "list";
}

function ScrollRevealItem({
  lecture,
  index,
  onLike,
  isLiked,
  viewMode,
}: ScrollRevealItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0.15,
    margin: "-80px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.92 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0.2, y: 50, scale: 0.95 }
      }
      transition={{
        duration: 0.9,
        delay: 0.1,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="relative group"
    >
      {/* Background glow effect */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          isInView && "opacity-100",
        )}
        style={{
          transform: `scale(${isInView ? 1 : 0.9})`,
          transition: "transform 0.9s cubic-bezier(0.21, 0.47, 0.32, 0.98)",
        }}
      />

      {/* Number badge */}
      <div className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 z-10 hidden md:block">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-5xl font-bold text-white/5 tracking-tighter"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>
      </div>

      {/* Timeline line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden md:block" />

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-700",
          isInView ? "translate-x-0" : "-translate-x-8",
        )}
      >
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <LectureCard
              lecture={lecture}
              index={index}
              onLike={() => onLike(lecture.id)}
              isLiked={isLiked}
            />
          </div>
        ) : (
          <LectureCard
            lecture={lecture}
            index={index}
            onLike={() => onLike(lecture.id)}
            isLiked={isLiked}
          />
        )}
      </div>

      {/* Decorative dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/40 border-2 border-background hidden md:block"
      />

      {/* Progress indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: "100%" } : { width: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute -bottom-3 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-primary/10 rounded-full"
      />
    </motion.div>
  );
}
