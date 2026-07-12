// src/components/dashboard/QuickAccess.tsx
// FIXED: Removed duplicate navigation items, improved mobile

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bell,
  BookOpen,
  Calendar,
  Download,
  FileText,
  MessageSquare,
  Server,
  Shield,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// ✅ FIXED: Loại bỏ trùng lặp URLs
const QUICK_ACCESS_ITEMS = [
  {
    icon: FileText,
    label: "Tài liệu",
    color: "from-blue-500 to-cyan-500",
    href: "/documents",
  },
  {
    icon: Video,
    label: "Bài giảng",
    color: "from-purple-500 to-pink-500",
    href: "/lectures",
  },
  {
    icon: Calendar,
    label: "Lịch học",
    color: "from-green-500 to-emerald-500",
    href: "/schedule",
  },
  {
    icon: Bell,
    label: "Thông báo",
    color: "from-orange-500 to-red-500",
    href: "/announcements",
  },
  {
    icon: Users,
    label: "Lớp học",
    color: "from-pink-500 to-rose-500",
    href: "/courses",
  },
  {
    icon: BookOpen,
    label: "Môn học",
    color: "from-cyan-500 to-blue-500",
    href: "/subjects",
  },
  {
    icon: Server,
    label: "Phần mềm",
    color: "from-indigo-500 to-purple-500",
    href: "/software",
  },
  {
    icon: Shield,
    label: "Bảo mật",
    color: "from-red-500 to-orange-500",
    href: "/security",
  },
  {
    icon: MessageSquare,
    label: "Diễn đàn",
    color: "from-teal-500 to-cyan-500",
    href: "/forum",
  },
  {
    icon: Download,
    label: "Tải về",
    color: "from-amber-500 to-yellow-500",
    href: "/downloads",
  },
];

export function QuickAccess() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Truy cập nhanh
            <span className="text-xs text-muted-foreground font-normal ml-2">
              • {QUICK_ACCESS_ITEMS.length} tiện ích
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ FIXED: Mobile responsive - 3 cột trên mobile, 5 trên desktop */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {QUICK_ACCESS_ITEMS.map((item, index) => (
              <Link href={item.href} key={index}>
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all group w-full relative overflow-hidden border border-transparent hover:border-primary/20"
                >
                  <div
                    className={cn(
                      "w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r",
                      item.color,
                      "flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all relative",
                    )}
                  >
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    {hoveredIndex === index && (
                      <motion.div
                        layoutId="glow"
                        className="absolute inset-0 rounded-xl bg-white/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </div>
                  <span className="text-[10px] md:text-sm font-medium text-foreground group-hover:text-primary transition-colors text-center leading-tight">
                    {item.label}
                  </span>
                </motion.button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
