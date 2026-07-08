// src/components/forum/PostDetailContent.tsx
// Vai trò: Nội dung bài viết

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface PostDetailContentProps {
  content: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  onLike: () => void;
  isLoading?: boolean;
}

export function PostDetailContent({
  content,
  tags,
  likes,
  isLiked,
  onLike,
  isLoading,
}: PostDetailContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-primary/10 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="whitespace-pre-wrap text-foreground text-base md:text-lg leading-relaxed">
              {content}
            </p>
          </div>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-border">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              className="gap-2 transition-all duration-300"
              onClick={onLike}
              disabled={isLoading}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-white" : ""} transition-all duration-300 ${
                  isLiked ? "scale-110" : "scale-100"
                }`}
              />
              {isLiked ? "Đã thích" : "Thích"} ({likes})
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
