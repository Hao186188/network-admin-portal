// src/app/(routes)/announcements/components/AnnouncementCard.tsx
// Vai trò: Card thông báo - FIXED

"use client";

import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, Heart, Pin, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    priority: "high" | "medium" | "low";
    pinned: boolean;
    category: string;
    author: string;
    views: number;
    comments: number;
    likes: number;
    created_at: string;
  };
  index: number;
  // ✅ SỬA: viewMode không bắt buộc
  viewMode?: "grid" | "list";
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const priorityColors = {
  high: "border-red-500/30 bg-red-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  low: "border-blue-500/30 bg-blue-500/5",
};

const priorityLabels = {
  high: "⚠️ Khẩn cấp",
  medium: "📌 Quan trọng",
  low: "ℹ️ Thông thường",
};

export function AnnouncementCard({
  announcement,
  index,
  viewMode = "grid",
  onFavorite,
  isFavorite = false,
}: AnnouncementCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: announcement.title,
          text: announcement.content.replace(/<[^>]*>/g, ""),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch (error) {
      toast.error("Không thể chia sẻ");
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavorite?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01, x: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Link href={`/announcements/${announcement.id}`}>
        <div
          className={cn(
            "relative p-[1px] rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
            "bg-gradient-to-r from-slate-800 via-cyan-500/30 to-slate-800",
            isHovered && "shadow-[0_0_30px_rgba(6,182,212,0.1)]",
            priorityColors[announcement.priority],
          )}
          style={{
            clipPath:
              "polygon(0 0, 95% 0, 100% 15px, 100% 100%, 5% 100%, 0 calc(100% - 15px))",
          }}
        >
          <div className="p-5 bg-slate-950/90 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-cyan-500/30 text-cyan-400"
                  >
                    {announcement.category}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    {priorityLabels[announcement.priority]}
                  </span>
                  {announcement.pinned && (
                    <Badge
                      variant="default"
                      className="text-xs gap-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                    >
                      <Pin className="w-3 h-3" />
                      Ghim
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-medium text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {announcement.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-1 mt-1">
                  {announcement.content.replace(/<[^>]*>/g, "")}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span>{announcement.author}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(announcement.created_at)}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {announcement.views}
                  </span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={handleFavorite}
                  className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4 transition-all",
                      isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-slate-500 hover:text-red-400",
                    )}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <Share2 className="w-4 h-4 text-slate-500 hover:text-cyan-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Shimmer effect on hover */}
          <div
            className={cn(
              "absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -skew-x-12 transition-transform duration-700",
              isHovered ? "translate-x-full" : "-translate-x-full",
            )}
          />

          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500/20" />
        </div>
      </Link>
    </motion.div>
  );
}
