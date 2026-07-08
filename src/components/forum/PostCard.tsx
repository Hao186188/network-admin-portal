// src/components/forum/PostCard.tsx
// Vai trò: Card hiển thị bài viết

"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    Award,
    Bell,
    Clock,
    Eye,
    Heart,
    MessageSquare,
    Pin,
    Reply,
    TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  is_pinned: boolean;
  is_locked: boolean;
  views: number;
  likes: number;
  replies: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface PostCardProps {
  post: ForumPost;
  onLike: (id: string) => void;
}

// Helper components
const HelpCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const Share2 = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const categoryColors: Record<string, string> = {
  "Thảo luận": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Hỏi đáp": "bg-green-500/10 text-green-500 border-green-500/20",
  "Chia sẻ": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Thông báo": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Kinh nghiệm": "bg-pink-500/10 text-pink-500 border-pink-500/20",
  "Dự án": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
};

const categoryIcons: Record<string, any> = {
  "Thảo luận": MessageSquare,
  "Hỏi đáp": HelpCircle,
  "Chia sẻ": Share2,
  "Thông báo": Bell,
  "Kinh nghiệm": Award,
  "Dự án": TrendingUp,
};

export function PostCard({ post, onLike }: PostCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike(post.id);
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const CategoryIcon = categoryIcons[post.category] || MessageSquare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`group hover:shadow-2xl transition-all duration-300 cursor-pointer ${
          post.is_pinned
            ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20"
            : ""
        }`}
        onClick={() => router.push(`/forum/${post.id}`)}
      >
        <CardContent className="p-4 md:p-6">
          <div className="flex items-start gap-3 md:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg shadow-primary-500/25">
                {post.author_name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1.5">
                {post.is_pinned && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Pin className="w-3 h-3" />
                    Ghim
                  </Badge>
                )}
                {post.is_locked && (
                  <Badge variant="destructive" className="text-xs">
                    Đã khóa
                  </Badge>
                )}
                <Badge
                  className={`text-xs ${categoryColors[post.category] || "bg-gray-500/10 text-gray-500"}`}
                >
                  <CategoryIcon className="w-3 h-3 mr-1" />
                  {post.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(post.created_at)}
                </span>
              </div>

              <h3 className="text-base md:text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {post.content}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-3 pt-3 border-t border-border/50">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors touch-friendly"
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`}
                  />
                  <span>{likes}</span>
                </button>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Reply className="w-4 h-4" />
                  {post.replies}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  {post.views}
                </span>
                <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">
                  bởi {post.author_name}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
