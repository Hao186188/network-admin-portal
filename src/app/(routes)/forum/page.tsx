// src/app/(routes)/forum/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Filter,
    Heart,
    MessageCircle,
    MessageSquare,
    Pin,
    Plus,
    Reply,
    Search
} from "lucide-react";
import { useState } from "react";

const posts = [
  {
    id: 1,
    title: "Hướng dẫn cấu hình VLAN trên Cisco",
    author: "Nguyễn Văn A",
    avatar: "A",
    date: "2026-06-20T10:30:00",
    category: "Hỏi đáp",
    tags: ["VLAN", "Cisco", "Switch"],
    replies: 5,
    likes: 12,
    views: 45,
    pinned: true,
    content:
      "Mọi người có thể hướng dẫn em cách cấu hình VLAN trên Switch Cisco 2960 không ạ?",
  },
  {
    id: 2,
    title: "Chia sẻ tài liệu ôn tập thi giữa kỳ",
    author: "Trần Thị B",
    avatar: "B",
    date: "2026-06-19T15:20:00",
    category: "Chia sẻ",
    tags: ["Tài liệu", "Ôn tập", "Giữa kỳ"],
    replies: 8,
    likes: 25,
    views: 78,
    pinned: false,
    content:
      "Mình tổng hợp một số tài liệu ôn tập cho kỳ thi giữa kỳ, chia sẻ với cả lớp.",
  },
  {
    id: 3,
    title: "Lỗi khi cài đặt Packet Tracer trên Windows 11",
    author: "Lê Văn C",
    avatar: "C",
    date: "2026-06-18T08:45:00",
    category: "Hỏi đáp",
    tags: ["Packet Tracer", "Windows 11", "Lỗi"],
    replies: 3,
    likes: 8,
    views: 34,
    pinned: false,
    content:
      "Mình gặp lỗi khi cài đặt Packet Tracer trên Windows 11, ai biết cách fix không?",
  },
];

const categories = ["Tất cả", "Hỏi đáp", "Chia sẻ", "Thông báo", "Thảo luận"];
const tags = [
  "VLAN",
  "Cisco",
  "Packet Tracer",
  "Tài liệu",
  "Ôn tập",
  "Windows 11",
];

export default function ForumPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || post.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleLike = (id: number) => {
    setLikedPosts((prev) =>
      prev.includes(id)
        ? prev.filter((postId) => postId !== id)
        : [...prev, id],
    );
    toast.success(
      likedPosts.includes(id) ? "Đã bỏ thích" : "Đã thích bài viết",
    );
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
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Diễn Đàn
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Thảo luận, hỏi đáp và chia sẻ kiến thức
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Tạo bài viết mới
          </Button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </div>
          </div>

          {/* Categories */}
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

        {/* Posts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {filteredPosts.map((post, index) => {
            const isLiked = likedPosts.includes(post.id);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${post.pinned ? "border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                          {post.avatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.pinned && (
                                <Badge variant="secondary" className="gap-1">
                                  <Pin className="w-3 h-3" />
                                  Ghim
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {post.category}
                              </Badge>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(post.date)}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                            onClick={() => toggleLike(post.id)}
                          >
                            <Heart
                              className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`}
                            />
                            {post.likes + (isLiked ? 1 : 0)}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Reply className="w-4 h-4" />
                            {post.replies} trả lời
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {post.views} lượt xem
                          </Button>
                          <span className="text-sm text-gray-400 dark:text-gray-500 ml-auto">
                            bởi {post.author}
                          </span>
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
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy bài viết
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy tạo bài viết mới để bắt đầu thảo luận
            </p>
            <Button className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Tạo bài viết mới
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
