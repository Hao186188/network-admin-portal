// src/components/forum/PostDetailHeader.tsx
// Vai trò: Header của trang chi tiết bài viết

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Clock, Eye, Heart, MessageCircle, Pin, User } from "lucide-react";

interface PostDetailHeaderProps {
  post: {
    title: string;
    category: string;
    author_name: string;
    views: number;
    likes: number;
    replies: number;
    is_pinned: boolean;
    created_at: string;
  };
}

export function PostDetailHeader({ post }: PostDetailHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-primary/10 shadow-xl">
        <CardContent className="p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {post.is_pinned && (
                <Badge variant="secondary" className="gap-1">
                  <Pin className="w-3 h-3" />
                  Ghim
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/5">
                {post.category}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(post.created_at)}
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold mb-4 gradient-text">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views} lượt xem
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {post.likes} lượt thích
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {post.replies} trả lời
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
