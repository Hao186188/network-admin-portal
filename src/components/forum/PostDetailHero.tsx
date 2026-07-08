// src/components/forum/PostDetailHero.tsx
// Vai trò: Hero section cho trang chi tiết

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";

interface PostDetailHeroProps {
  title: string;
}

export function PostDetailHero({ title }: PostDetailHeroProps) {
  return (
    <section className="relative overflow-hidden py-8 md:py-12 px-4 rounded-2xl mb-4">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Floating orbs */}
      <div className="absolute top-10 right-20 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-secondary-500/10 rounded-full blur-2xl" />

      <div className="max-w-4xl mx-auto relative">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/forum">
            <Button
              variant="ghost"
              className="gap-2 hover:bg-primary/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
          <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white border-0 gap-1">
            <Sparkles className="w-3 h-3" />
            Đang xem
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold gradient-text line-clamp-2">
            {title}
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Đọc và thảo luận bài viết
          </p>
        </motion.div>
      </div>
    </section>
  );
}
