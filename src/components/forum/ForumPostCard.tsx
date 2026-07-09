// src/components/forum/ForumPostCard.tsx
// Vai trò: Card bài viết - TÍCH HỢP MENU 3 CHẤM

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { ForumPost } from "@/types";
import { motion } from "framer-motion";
import {
  Eye,
  Lock,
  MessageCircle,
  Pin,
  Share2,
  ThumbsUp,
  ThumbsUp as ThumbsUpFilled,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ForumImageGallery } from "./ForumImageGallery";
import { ForumPostMenu } from "./ForumPostMenu";

interface ForumPostCardProps {
  post: ForumPost;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onPin?: (postId: string) => void;
  onLock?: (postId: string) => void;
  isLiked?: boolean;
  index?: number;
}

export function ForumPostCard({
  post,
  onLike,
  onDelete,
  onPin,
  onLock,
  isLiked = false,
  index = 0,
}: ForumPostCardProps) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  // Lấy danh sách ảnh từ attachments
  const images =
    post.attachments
      ?.filter((att) => att.file_type?.startsWith("image/"))
      .map((att) => att.file_url) || [];

  const hasImages = images.length > 0;
  const totalFiles = post.attachments?.length || 0;
  const otherFiles = totalFiles - images.length;

  const handleLike = () => {
    const newState = !isLikedState;
    setIsLikedState(newState);
    setLikesCount((prev) => (newState ? prev + 1 : prev - 1));
    onLike?.(post.id);
  };

  const handleEdit = () => {
    window.location.href = `/forum/edit/${post.id}`;
  };

  const handleDelete = () => {
    onDelete?.(post.id);
  };

  const handlePin = () => {
    onPin?.(post.id);
  };

  const handleLock = () => {
    onLock?.(post.id);
  };

  const truncateContent = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Thảo luận": "bg-blue-500",
      "Hỏi đáp": "bg-green-500",
      "Chia sẻ": "bg-purple-500",
      "Thông báo": "bg-orange-500",
      "Kinh nghiệm": "bg-pink-500",
      "Dự án": "bg-cyan-500",
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow",
        post.is_pinned && "border-primary/30 bg-primary/5",
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Link href={`/profile/${post.author_id}`}>
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author_avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                {post.author_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${post.author_id}`}
                className="font-semibold hover:underline text-sm"
              >
                {post.author_name}
              </Link>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px] px-2 py-0 text-white",
                  getCategoryColor(post.category),
                )}
              >
                {post.category}
              </Badge>
              {post.is_pinned && (
                <Badge
                  variant="default"
                  className="text-[10px] px-2 py-0 gap-1"
                >
                  <Pin className="w-3 h-3" />
                  Ghim
                </Badge>
              )}
              {post.is_locked && (
                <Badge
                  variant="destructive"
                  className="text-[10px] px-2 py-0 gap-1"
                >
                  <Lock className="w-3 h-3" />
                  Khóa
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>{formatRelativeTime(post.created_at)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views}
              </span>
            </div>
          </div>

          {/* ✅ Menu 3 chấm */}
          <ForumPostMenu
            postId={post.id}
            authorId={post.author_id}
            isPinned={post.is_pinned}
            isLocked={post.is_locked}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPin={handlePin}
            onLock={handleLock}
          />
        </div>

        {/* Content */}
        <Link href={`/forum/${post.id}`} className="block mt-3">
          <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <div className="mt-2 text-muted-foreground text-sm leading-relaxed">
            {showFullContent ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>{truncateContent(post.content)}</p>
            )}
            {post.content.length > 300 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowFullContent(!showFullContent);
                }}
                className="text-primary hover:underline text-sm mt-1"
              >
                {showFullContent ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Images Gallery */}
        {hasImages && (
          <div className="mt-3 relative">
            <ForumImageGallery images={images} />
            {otherFiles > 0 && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                +{otherFiles} file khác
              </div>
            )}
          </div>
        )}

        {/* File attachments */}
        {totalFiles > 0 && !hasImages && (
          <div className="mt-3 p-3 bg-muted/30 rounded-xl flex items-center gap-2 text-sm text-muted-foreground">
            <span>📎</span>
            <span>{totalFiles} file đính kèm</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-1.5 rounded-full",
                isLikedState && "text-primary hover:text-primary",
              )}
              onClick={handleLike}
              disabled={post.is_locked}
            >
              {isLikedState ? (
                <ThumbsUpFilled className="w-4 h-4 fill-primary" />
              ) : (
                <ThumbsUp className="w-4 h-4" />
              )}
              <span>{likesCount > 0 && likesCount}</span>
            </Button>
            <Link href={`/forum/${post.id}`}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 rounded-full"
                disabled={post.is_locked}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.replies > 0 && post.replies}</span>
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
