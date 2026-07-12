// src/app/(routes)/lectures/components/LectureCard.tsx
// LECTURE CARD - HOÀN CHỈNH

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn, formatRelativeTime } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  Eye,
  FileText,
  Heart,
  Monitor,
  Play,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Lecture } from "../types";

interface LectureCardProps {
  lecture: Lecture;
  index: number;
  onLike?: () => void;
  isLiked?: boolean;
}

// ✅ Định nghĩa type cho config
type LectureType = "video" | "slide" | "lab" | "document";

interface TypeConfig {
  icon: any;
  color: string;
  label: string;
  bg: string;
}

const typeConfig: Record<LectureType, TypeConfig> = {
  video: {
    icon: Video,
    color: "from-red-500 to-red-600",
    label: "Video",
    bg: "bg-red-500/10",
  },
  slide: {
    icon: FileText,
    color: "from-blue-500 to-blue-600",
    label: "Slide",
    bg: "bg-blue-500/10",
  },
  lab: {
    icon: Monitor,
    color: "from-green-500 to-green-600",
    label: "Lab",
    bg: "bg-green-500/10",
  },
  document: {
    icon: BookOpen,
    color: "from-purple-500 to-purple-600",
    label: "Tài liệu",
    bg: "bg-purple-500/10",
  },
};

export function LectureCard({
  lecture,
  index,
  onLike,
  isLiked = false,
}: LectureCardProps) {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Sử dụng type an toàn
  const lectureType = lecture.type as LectureType;
  const TypeIcon = typeConfig[lectureType]?.icon || FileText;
  const config = typeConfig[lectureType] || typeConfig.document;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: lecture.title,
          text: lecture.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Đã sao chép link");
      }
    } catch (error) {
      // User cancelled
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/lectures/${lecture.id}`}>
        <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl h-full">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
            {lecture.thumbnail ? (
              <img
                src={lecture.thumbnail}
                alt={lecture.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div
                  className={cn(
                    "w-16 h-16 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
                    config.color,
                  )}
                >
                  <TypeIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* Type Badge */}
            <Badge
              className={cn(
                "absolute top-3 left-3 gap-1.5 border-none",
                config.bg,
                "text-foreground",
              )}
            >
              <TypeIcon className="w-3 h-3" />
              {config.label}
            </Badge>

            {/* Duration Badge */}
            {lecture.duration && (
              <Badge
                variant="outline"
                className="absolute top-3 right-3 gap-1.5 bg-background/80 backdrop-blur-sm border-border/50"
              >
                <Clock className="w-3 h-3" />
                {lecture.duration}
              </Badge>
            )}

            {/* Hover overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <Button
                variant="default"
                size="lg"
                className="gap-2 rounded-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg"
              >
                <Play className="w-4 h-4" />
                Xem ngay
              </Button>
            </div>
          </div>

          <CardContent className="p-4 md:p-5">
            {/* Title */}
            <h3 className="text-base md:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {lecture.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {lecture.description}
            </p>

            {/* Tags */}
            {lecture.tags && lecture.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {lecture.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {lecture.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{lecture.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {lecture.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {lecture.likes || 0}
                </span>
                <span className="hidden sm:inline">
                  {formatRelativeTime(lecture.created_at)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-red-500/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLike?.();
                  }}
                >
                  <Heart
                    className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground",
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary/10"
                  onClick={handleShare}
                >
                  <svg
                    className="w-3.5 h-3.5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
