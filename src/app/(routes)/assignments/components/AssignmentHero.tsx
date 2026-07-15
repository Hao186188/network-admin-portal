// src/app/(routes)/assignments/components/AssignmentHero.tsx
// NÂNG CẤP - TÍCH HỢP HIỆU ỨNG NETWORK/SYSTEM ADMIN

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

// ============================================
// NETWORK PULSE INDICATOR
// ============================================

function NetworkPulse() {
  return (
    <div className="relative flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-cyan-400" />
        <div className="absolute inset-0 w-2 h-2 rounded-full bg-cyan-400 animate-ping opacity-75" />
        <div className="absolute inset-[-6px] w-[20px] h-[20px] rounded-full bg-cyan-400/20 animate-pulse" />
      </div>
      <span className="text-[10px] text-cyan-400 font-mono tracking-wider">
        SYSTEM ONLINE • NODE: ACTIVE
      </span>
    </div>
  );
}

// ============================================
// TERMINAL TYPING EFFECT
// ============================================

function TerminalTyping({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={cn("font-mono tracking-tight", className)}>
      <span className="text-cyan-400">$</span> {displayText}
      {!isComplete && (
        <span className="inline-block w-0.5 h-5 bg-cyan-400 animate-pulse ml-1" />
      )}
    </span>
  );
}

// ============================================
// DATA PACKET FLOW - FIX HYDRATION
// ============================================

function DataPacketFlow() {
  const [packets, setPackets] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const newPackets = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 4,
      delay: Math.random() * 4,
    }));
    setPackets(newPackets);
  }, []);

  if (!mounted || packets.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {packets.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            opacity: [0, 0.6, 0],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// ANIMATED COUNTER
// ============================================

function AnimatedCounter({ value, label, icon: Icon, color }: any) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let startTime: number;
    const duration = 1000;
    const startValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * (value - startValue) + startValue);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all group"
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
          color,
        )}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <motion.p
          key={displayValue}
          animate={{
            y: isGlitching ? [0, -2, 2, -1, 1, 0] : 0,
            opacity: 1,
            x: isGlitching ? [0, -1, 1, 0] : 0,
          }}
          transition={{ duration: 0.1 }}
          className="text-xl font-bold text-white tabular-nums font-mono"
        >
          {displayValue}
        </motion.p>
        <p className="text-xs text-white/60">{label}</p>
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
  overdueCount: number;
  completedPercentage: number;
  onCreateClick: () => void;
}

export function AssignmentHero({
  totalAssignments,
  pendingCount,
  submittedCount,
  gradedCount,
  overdueCount,
  onCreateClick,
}: AssignmentHeroProps) {
  const [showTerminal, setShowTerminal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTerminal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Data Packet Flow Background */}
      <DataPacketFlow />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          {/* Network Pulse Status */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <NetworkPulse />
          </motion.div>

          {/* Terminal Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2"
          >
            {showTerminal && (
              <TerminalTyping
                text="admin@asme-net:~$ cd /assignments && ls -la"
                className="text-sm text-cyan-400/70"
              />
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              📋 Quản lý bài tập
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white/60 text-sm md:text-base font-mono"
          >
            <span className="text-cyan-400">//</span> Quản lý bài tập, theo dõi
            tiến độ và nộp bài trực tuyến
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3 mt-4"
          >
            <Button
              onClick={onCreateClick}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg shadow-cyan-500/25 group relative overflow-hidden"
            >
              <Sparkles className="w-4 h-4" />
              Tạo bài tập mới
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
            >
              <Zap className="w-4 h-4 mr-2" />
              Xem thống kê
            </Button>
          </motion.div>
        </div>

        {/* Stats Counters - Grid responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 w-full lg:w-auto">
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
          <AnimatedCounter
            value={overdueCount}
            label="Quá hạn"
            icon={AlertCircle}
            color="from-red-500 to-rose-500"
          />
        </div>
      </div>

      {/* Bottom Status Bar - Network Style */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/30 font-mono"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
          <span>•</span>
          <span>UPTIME: 24h</span>
          <span>•</span>
          <span>NODE: 12/12</span>
          <span>•</span>
          <span>PACKETS: 1.2k</span>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <span>CPU: 32%</span>
          <span>MEM: 45%</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            NET: 72ms
          </span>
        </div>
      </motion.div>
    </div>
  );
}
