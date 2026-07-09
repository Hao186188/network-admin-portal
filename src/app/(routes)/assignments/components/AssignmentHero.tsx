// src/app/(routes)/assignments/components/AssignmentHero.tsx
// Vai trò: Hero section - HOÀN CHỈNH

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    CheckCircle,
    Clock,
    FileText,
    Search,
    Sparkles,
    Star,
    TrendingUp
} from "lucide-react";
import { useEffect, useState } from "react";

// ============================================
// ANIMATED COUNTER
// ============================================

function AnimatedCounter({ value, label, icon: Icon, color }: any) {
  const [displayValue, setDisplayValue] = useState(0);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const spring = useSpring(count, { stiffness: 100, damping: 30 });

  useEffect(() => {
    spring.set(value);
    const unsubscribe = spring.onChange((latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [value, spring]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all group"
    >
      <div
        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-xl font-bold text-white tabular-nums">
          {displayValue}
        </p>
        <p className="text-xs text-white/60">{label}</p>
      </div>
    </motion.div>
  );
}

// ============================================
// SCRAMBLE TEXT EFFECT
// ============================================

function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isComplete, setIsComplete] = useState(false);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

  useEffect(() => {
    let iterations = 0;
    const maxIterations = 20;
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplayText(text);
        setIsComplete(true);
        clearInterval(interval);
        return;
      }

      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations / 2) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );
      iterations++;
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={cn("font-mono tracking-tight", className)}>
      {displayText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-6 bg-primary animate-pulse ml-1" />
      )}
    </span>
  );
}

// ============================================
// FLOATING CHART
// ============================================

function FloatingChart({
  completedPercentage = 0,
}: {
  completedPercentage?: number;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      className="relative w-48 h-48 hidden lg:block"
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-slow" />
      <div className="absolute inset-4 rounded-full border-2 border-secondary/20 animate-spin-slow-reverse" />
      <div
        className="absolute inset-8 rounded-full border-2 border-accent/20 animate-spin-slow"
        style={{ animationDuration: "8s" }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
      </div>

      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 60;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px - 4px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px - 4px)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25,
            }}
          />
        );
      })}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">
            {Math.round(completedPercentage)}%
          </p>
          <p className="text-[10px] text-white/60">Hoàn thành</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// MAIN HERO COMPONENT
// ============================================

interface AssignmentHeroProps {
  totalAssignments: number;
  pendingCount: number;
  submittedCount: number;
  gradedCount: number;
  completedPercentage: number;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

export function AssignmentHero({
  totalAssignments,
  pendingCount,
  submittedCount,
  gradedCount,
  completedPercentage,
  onSearch,
  onCreateClick,
}: AssignmentHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-mono">
              SYSTEM ONLINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
          >
            <ScrambleText text="📋 Quản lý bài tập" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/60 text-sm md:text-base"
          >
            Quản lý bài tập, theo dõi tiến độ và nộp bài trực tuyến
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative mt-4 max-w-lg"
          >
            <div
              className={cn(
                "relative transition-all duration-300",
                isFocused && "scale-[1.02]",
              )}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Tìm kiếm bài tập theo tên, môn học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="pl-12 pr-32 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 transition-all"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                Tìm kiếm
              </Button>
            </div>

            {isFocused && (
              <motion.div
                className="absolute inset-0 -z-10 rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.8, 1.2, 1.6],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              >
                <div className="w-full h-full rounded-xl bg-primary/20 blur-2xl" />
              </motion.div>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-4"
          >
            <Button
              onClick={onCreateClick}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Tạo bài tập mới
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white/70 hover:text-white hover:border-primary/50"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Xem thống kê
            </Button>
          </motion.div>
        </div>

        <div className="flex items-center gap-4">
          <FloatingChart completedPercentage={completedPercentage} />

          <div className="space-y-2">
            <AnimatedCounter
              value={totalAssignments}
              label="Tổng bài tập"
              icon={FileText}
              color="from-blue-500 to-cyan-500"
            />
            <AnimatedCounter
              value={pendingCount}
              label="Chưa nộp"
              icon={Clock}
              color="from-yellow-500 to-orange-500"
            />
            <AnimatedCounter
              value={submittedCount}
              label="Đã nộp"
              icon={CheckCircle}
              color="from-green-500 to-emerald-500"
            />
            <AnimatedCounter
              value={gradedCount}
              label="Đã chấm"
              icon={Star}
              color="from-purple-500 to-pink-500"
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/30 font-mono"
      >
        <div className="flex items-center gap-4">
          <span>⚡ SYSTEM v3.2.1</span>
          <span>•</span>
          <span>TỔNG: {totalAssignments} bài tập</span>
          <span>•</span>
          <span>HOÀN THÀNH: {Math.round(completedPercentage)}%</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ĐÃ NỘP: {submittedCount}</span>
          <span>CHƯA NỘP: {pendingCount}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            LIVE
          </span>
        </div>
      </motion.div>
    </div>
  );
}
