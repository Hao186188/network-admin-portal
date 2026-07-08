// src/components/forum/ForumPageHero.tsx
// Vai trò: Hero section cho trang forum chính

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    Award,
    BookOpen,
    Code,
    Globe,
    Heart,
    MessageSquare,
    Plus,
    Reply,
    Search,
    Shield,
    Sparkles,
    Users,
    Zap,
} from "lucide-react";

interface ForumPageHeroProps {
  stats: {
    totalPosts: number;
    totalReplies: number;
    totalMembers: number;
    totalLikes: number;
  };
  onCreatePost: () => void;
}

const iconItems = [Code, Shield, Globe, Zap, BookOpen, Award];

export function ForumPageHero({ stats, onCreatePost }: ForumPageHeroProps) {
  const statItems = [
    { value: stats.totalPosts, label: "Bài viết", icon: MessageSquare },
    { value: stats.totalReplies, label: "Trả lời", icon: Reply },
    { value: stats.totalMembers, label: "Sinh viên", icon: Users },
    { value: stats.totalLikes, label: "Lượt thích", icon: Heart },
  ];

  return (
    <section className="relative overflow-hidden pt-16 md:pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-accent-500/10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />

      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent animate-pulse" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary-500/20 to-transparent animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 px-4 py-2 text-sm gap-2 shadow-lg shadow-primary-500/25">
                <Sparkles className="w-3 h-3" />
                Cộng đồng học tập
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              <span className="bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                Diễn Đàn
              </span>
              <br />
              <span className="text-foreground">Mạng 3 Hub</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Nơi kết nối, thảo luận và chia sẻ kiến thức mạng với cộng đồng
              những người đam mê công nghệ
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4"
            >
              {statItems.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-3 border border-border/50 hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <stat.icon className="w-4 h-4" />
                    <span className="text-xl md:text-2xl font-bold">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Button
                size="lg"
                className="gap-2 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
                onClick={onCreatePost}
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Tạo bài viết mới
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-2"
                onClick={() =>
                  document
                    .getElementById("search-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Search className="w-4 h-4" />
                Tìm kiếm
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Central node */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-300/30 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-pulse">
                    <MessageSquare className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>

              {/* Orbiting nodes với animation */}
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const Icon = iconItems[i];
                return (
                  <motion.div
                    key={i}
                    className="absolute w-12 h-12 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-xl border border-primary-200/50 flex items-center justify-center"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20 + i * 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs">Cuộn xuống</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
