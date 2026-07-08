// src/components/forum/CreatePostHero.tsx
// Vai trò: Hero section cho trang tạo bài viết

"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

export function CreatePostHero() {
  return (
    <section className="relative overflow-hidden py-8 md:py-12 px-4 rounded-2xl mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Floating orbs */}
      <div className="absolute top-5 right-10 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-5 left-10 w-32 h-32 bg-secondary-500/10 rounded-full blur-2xl" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 px-4 py-2 gap-2 shadow-lg shadow-primary-500/25">
            <Sparkles className="w-3 h-3" />
            Viết bài
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold gradient-text">
            Tạo bài viết mới
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Chia sẻ kiến thức và thảo luận với cộng đồng
          </p>
        </motion.div>
      </div>
    </section>
  );
}
