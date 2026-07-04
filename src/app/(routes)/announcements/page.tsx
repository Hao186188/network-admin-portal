// src/app/(routes)/announcements/page.tsx
// Vai trò: Hiển thị và quản lý các thông báo của lớp học

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Bell,
    Bookmark,
    Eye,
    Heart,
    MessageCircle,
    Pin,
    Search,
    Share2,
    Users
} from "lucide-react";
import { useState } from "react";

const announcements = [
  {
    id: 1,
    title: "Thông báo lịch thi giữa kỳ",
    content:
      "Kỳ thi giữa kỳ sẽ diễn ra từ ngày 25/06/2026 đến 30/06/2026. Vui lòng xem lịch thi chi tiết tại trang Lịch thi.",
    date: "2026-06-20T08:00:00",
    priority: "high",
    pinned: true,
    category: "Thi cử",
    author: "Nguyễn Ngọc Thanh",
    views: 156,
    comments: 12,
    likes: 45,
  },
  {
    id: 2,
    title: "Cập nhật lịch trực phòng máy",
    content:
      "Lịch trực phòng máy tháng 7 đã được cập nhật. Xem chi tiết tại trang Lịch học.",
    date: "2026-06-19T10:30:00",
    priority: "medium",
    pinned: false,
    category: "Phòng máy",
    author: "Nguyễn Ngọc Thanh",
    views: 89,
    comments: 5,
    likes: 23,
  },
  {
    id: 3,
    title: "Bài tập tuần 5 đã được đăng tải",
    content:
      "Bài tập tuần 5 về VLAN và định tuyến đã có trên trang Bài tập. Hạn nộp: 27/06/2026.",
    date: "2026-06-18T14:15:00",
    priority: "medium",
    pinned: false,
    category: "Bài tập",
    author: "Nguyễn Ngọc Thanh",
    views: 67,
    comments: 8,
    likes: 34,
  },
  {
    id: 4,
    title: "Hướng dẫn cài đặt Packet Tracer",
    content:
      "Video hướng dẫn cài đặt và cấu hình Packet Tracer đã được đăng tải trên trang Bài giảng.",
    date: "2026-06-17T09:00:00",
    priority: "low",
    pinned: false,
    category: "Hướng dẫn",
    author: "Nguyễn Ngọc Thanh",
    views: 45,
    comments: 3,
    likes: 12,
  },
];

const categories = [
  "Tất cả",
  "Thi cử",
  "Phòng máy",
  "Bài tập",
  "Hướng dẫn",
  "Thông báo",
];
const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
};

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredAnnouncements = announcements.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
    toast.success(favorites.includes(id) ? "Đã bỏ lưu" : "Đã lưu thông báo");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Thông Báo
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Cập nhật thông tin và sự kiện mới nhất
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm thông báo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Announcements List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredAnnouncements.map((item, index) => {
            const isFavorite = favorites.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                    item.pinned
                      ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Priority Indicator */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-3 h-3 rounded-full ${priorityColors[item.priority as keyof typeof priorityColors]} mt-2`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.pinned && (
                                <Badge variant="secondary" className="gap-1">
                                  <Pin className="w-3 h-3" />
                                  Ghim
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(item.date)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {item.content}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {item.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {item.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {item.comments}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => toggleFavorite(item.id)}
                            >
                              <Heart
                                className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Bookmark className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Share2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Không có thông báo</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Không tìm thấy thông báo nào phù hợp
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
