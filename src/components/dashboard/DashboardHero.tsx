// src/components/dashboard/DashboardHero.tsx
// HOÀN CHỈNH - ĐÃ TÍCH HỢP TERMINAL TYPING & BEACON PULSE

"use client";

import { BeaconPulse } from "@/components/animations/BeaconPulse";
import { TerminalTyping } from "@/components/animations/TerminalTyping";
import { Badge } from "@/components/ui/badge";
import { useStats } from "@/hooks/use-stats";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Activity,
  BookOpen,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  Shield,
  TrendingUp,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

// ============================================
// SUB-COMPONENTS
// ============================================

// 1. Animated Number - Fixed Memory Leak
const AnimatedNumber = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let frameId: number;
    const startValue = 0;
    const endValue = value;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * (endValue - startValue) + startValue));
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [value, duration]);

  return <span className="tabular-nums">{displayValue.toLocaleString()}</span>;
};

// 2. Floating Particles
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, -20, 0],
            opacity: [0, 1, 0],
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
};

// 3. Grid Background
const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none">
    <svg
      className="w-full h-full opacity-10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-cyan-400"
          />
        </pattern>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      <rect width="100%" height="100%" fill="url(#glow)" />
    </svg>
  </div>
);

// 4. Status Badge - Fixed Dynamic Tailwind Classes
const STATUS_BADGE_COLORS = {
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    icon: "text-green-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    icon: "text-cyan-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    icon: "text-purple-400",
  },
} as const;

type StatusColor = keyof typeof STATUS_BADGE_COLORS;

const StatusBadge = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: StatusColor;
}) => {
  const colors = STATUS_BADGE_COLORS[color];

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full border",
        colors.bg,
        colors.border,
      )}
    >
      <Icon className={cn("w-3 h-3", colors.icon)} />
      <span className={cn("text-xs font-mono", colors.text)}>{label}</span>
    </div>
  );
};

// 5. Stat Item - Fixed Dynamic Tailwind Classes
const STAT_COLORS = {
  "from-blue-500 to-cyan-500": {
    bg: "from-blue-500 to-cyan-500",
    glow: "bg-blue-500/20",
  },
  "from-purple-500 to-pink-500": {
    bg: "from-purple-500 to-pink-500",
    glow: "bg-purple-500/20",
  },
  "from-orange-500 to-red-500": {
    bg: "from-orange-500 to-red-500",
    glow: "bg-orange-500/20",
  },
  "from-green-500 to-emerald-500": {
    bg: "from-green-500 to-emerald-500",
    glow: "bg-green-500/20",
  },
} as const;

type StatColor = keyof typeof STAT_COLORS;

const StatItem = ({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: StatColor;
  delay: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = STAT_COLORS[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-300",
          "bg-white/5 dark:bg-black/20",
          isHovered
            ? "border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            : "border-white/10",
        )}
      >
        <div
          className={cn(
            "absolute -inset-1 rounded-xl opacity-0 transition-opacity duration-300 blur-xl",
            isHovered && "opacity-100",
            colors.glow,
          )}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
              "bg-gradient-to-br",
              colors.bg,
              isHovered && "scale-110 shadow-lg shadow-cyan-500/25",
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white tabular-nums">
              <AnimatedNumber value={value} />
            </p>
            <p className="text-xs text-white/60 uppercase tracking-wider">
              {label}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent transition-all duration-1000",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export function DashboardHero() {
  const { data: session } = useSession();
  const stats = useStats();
  const [isMounted, setIsMounted] = useState(false);
  const [systemStats, setSystemStats] = useState({
    uptime: 0,
    node: 0,
    cpu: 0,
    mem: 0,
  });
  const [showTerminal, setShowTerminal] = useState(false);

  // Random values chỉ được sinh sau khi mounted để tránh hydration error
  useEffect(() => {
    setIsMounted(true);
    setSystemStats({
      uptime: Math.floor(Math.random() * 100 + 24),
      node: Math.floor(Math.random() * 10 + 1),
      cpu: Math.floor(Math.random() * 30 + 10),
      mem: Math.floor(Math.random() * 40 + 20),
    });
    // Hiển thị terminal sau 1.5s
    setTimeout(() => setShowTerminal(true), 1500);
  }, []);

  // Mouse parallax effect - Chỉ chạy trên desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  useEffect(() => {
    // Chỉ thêm mousemove khi là desktop
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Chào buổi sáng", emoji: "🌅" };
    if (hour < 18) return { text: "Chào buổi chiều", emoji: "🌤️" };
    return { text: "Chào buổi tối", emoji: "🌙" };
  };

  const greeting = getGreeting();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {/* Background */}
      <GridBackground />
      <FloatingParticles />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Status Bar với Beacon Pulse */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-white/5"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <BeaconPulse color="bg-green-400" label="SYSTEM ONLINE" />
          <BeaconPulse color="bg-cyan-400" label="LIVE" />
          <StatusBadge icon={Shield} label="SECURE" color="purple" />
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs font-mono">
          <Clock className="w-3 h-3" />
          <span>{new Date().toLocaleTimeString("vi-VN")}</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">v3.2.1</span>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="relative z-10"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 mb-2 flex-wrap"
            >
              <span className="text-2xl">🚀</span>
              <span className="text-white/60 text-sm font-medium tracking-wider">
                Terminal
              </span>
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-0 backdrop-blur-sm text-[10px]">
                <Zap className="w-3 h-3 mr-1" />
                LIVE
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {session?.user?.name?.split(" ")[0] || "Người dùng"}
              </span>
              <span className="text-white/60">,</span>
              <br />
              <div className="text-white/80 text-lg md:text-2xl mt-1">
                {showTerminal ? (
                  <TerminalTyping
                    text="Chào mừng đến với Mạng 3 Hub"
                    speed={40}
                    className="text-cyan-400 font-semibold"
                  />
                ) : (
                  <span className="text-cyan-400 font-semibold">
                    Mạng 3 Hub
                  </span>
                )}
              </div>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-white/50 text-sm md:text-base mt-2 max-w-lg"
            >
              Hệ thống quản lý học tập thông minh • Công nghệ AI • Dữ liệu thời
              gian thực
            </motion.p>

            {/* Quick Tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3 mt-4"
            >
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>{stats.documents || 0} tài liệu</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Users className="w-3 h-3 text-blue-400" />
                <span>{stats.students || 0} sinh viên</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Video className="w-3 h-3 text-purple-400" />
                <span>{stats.lectures || 0} bài giảng</span>
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Activity className="w-3 h-3 text-green-400" />
                <span>Hoạt động</span>
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs text-white/80 font-mono">AI Ready</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/80 font-mono">
                Cloud Sync
              </span>
            </div>
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/20 backdrop-blur-sm px-4 py-2">
              <CheckCircle className="w-3 h-3 mr-2" />
              <span className="text-xs font-mono">Đã kết nối</span>
            </Badge>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/5"
        >
          <StatItem
            icon={Users}
            label="Thành viên"
            value={stats.students || 0}
            color="from-blue-500 to-cyan-500"
            delay={0.8}
          />
          <StatItem
            icon={BookOpen}
            label="Tài liệu"
            value={stats.documents || 0}
            color="from-purple-500 to-pink-500"
            delay={0.9}
          />
          <StatItem
            icon={Video}
            label="Bài giảng"
            value={stats.lectures || 0}
            color="from-orange-500 to-red-500"
            delay={1.0}
          />
          <StatItem
            icon={TrendingUp}
            label="Tăng trưởng"
            value={stats.documents ? Math.floor(stats.documents * 1.2) : 0}
            color="from-green-500 to-emerald-500"
            delay={1.1}
          />
        </motion.div>
      </motion.div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="relative z-10 mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/30 font-mono"
      >
        <div className="flex items-center gap-4">
          <span>⚡ SYSTEM v3.2.1</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            UPTIME: {isMounted ? systemStats.uptime : 0}h
          </span>
          <span className="hidden lg:inline">•</span>
          <span className="hidden lg:inline">
            NODE: {isMounted ? systemStats.node : 0}/12
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>CPU: {isMounted ? systemStats.cpu : 0}%</span>
          <span>MEM: {isMounted ? systemStats.mem : 0}%</span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
