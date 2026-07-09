// src/app/(routes)/announcements/components/AnnouncementHero.tsx
// Vai trò: Hero section - Broadcast Hub - FIXED

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Radio, Search, Sparkles, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface AnnouncementHeroProps {
  total: number;
  onSearch: (query: string) => void;
  onCreateClick: () => void;
}

// Audio Waveform Animation
function AudioWaveform() {
  return (
    <div className="flex items-center gap-0.5 h-6">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-cyan-400 rounded-full"
          animate={{
            height: [4, 12 + Math.random() * 12, 4],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Scramble Text Effect - FIXED: chỉ nhận 1 argument
function ScrambleText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";

  // ✅ SỬA: useState không có callback, dùng useEffect
  useEffect(() => {
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        setDisplayText(text);
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

  return <span className="font-mono">{displayText}</span>;
}

// ✅ THÊM useEffect import
import { useEffect } from "react";

export function AnnouncementHero({
  total,
  onSearch,
  onCreateClick,
}: AnnouncementHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Glow Orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
          animate={{
            top: ["-10%", "110%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Top Bar - LIVE Status */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-mono">LIVE</span>
            <AudioWaveform />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">
              BROADCASTING
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <Users className="w-3 h-3 text-green-400" />
            <span className="text-xs text-green-400 font-mono">
              {total} THÔNG BÁO
            </span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold text-white mb-2"
        >
          <ScrambleText text="📡 Trung tâm thông báo" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-sm md:text-base"
        >
          Hệ thống cập nhật tin tức và thông báo quan trọng
        </motion.p>

        {/* Search */}
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
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="pl-12 pr-32 py-6 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 transition-all"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Tìm kiếm
            </Button>
          </div>
        </motion.form>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 mt-4"
        >
          <Button
            onClick={onCreateClick}
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
          >
            <Sparkles className="w-4 h-4" />
            Tạo thông báo
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-white/70 hover:text-white hover:border-cyan-500/50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Xem thống kê
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
