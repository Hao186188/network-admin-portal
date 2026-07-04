// src/app/(routes)/lectures/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Bookmark,
    Clock,
    Eye,
    FileText,
    Filter,
    Grid as GridIcon,
    Heart,
    List,
    Play,
    Search,
    Users,
    Video
} from "lucide-react";
import { useState } from "react";

const lectures = [
  {
    id: 1,
    title: "Bài giảng: Cấu trúc mạng cơ bản",
    description: "Tìm hiểu về các thành phần cơ bản của mạng máy tính",
    type: "video",
    duration: "45 phút",
    date: "2026-06-10",
    views: 120,
    likes: 45,
    teacher: "Nguyễn Ngọc Thanh",
    tags: ["Mạng cơ bản", "OSI", "TCP/IP"],
    videoUrl: "#",
    thumbnail: "/thumbnails/lecture1.jpg",
  },
  {
    id: 2,
    title: "Bài giảng: VLAN và định tuyến",
    description: "Hướng dẫn cấu hình VLAN và định tuyến trên Cisco",
    type: "video",
    duration: "60 phút",
    date: "2026-06-12",
    views: 95,
    likes: 32,
    teacher: "Nguyễn Ngọc Thanh",
    tags: ["VLAN", "Định tuyến", "Cisco"],
    videoUrl: "#",
    thumbnail: "/thumbnails/lecture2.jpg",
  },
  {
    id: 3,
    title: "Slide: Quản trị mạng nâng cao",
    description: "Slide bài giảng về quản trị mạng với các kỹ thuật nâng cao",
    type: "slide",
    duration: "90 phút",
    date: "2026-06-15",
    views: 67,
    likes: 28,
    teacher: "Nguyễn Ngọc Thanh",
    tags: ["Quản trị mạng", "Nâng cao", "CCNA"],
    videoUrl: "#",
    thumbnail: "/thumbnails/lecture3.jpg",
  },
  {
    id: 4,
    title: "Bài giảng: Bảo mật mạng",
    description: "Các kỹ thuật bảo mật mạng cơ bản và nâng cao",
    type: "video",
    duration: "55 phút",
    date: "2026-06-18",
    views: 78,
    likes: 34,
    teacher: "Nguyễn Ngọc Thanh",
    tags: ["Bảo mật", "Firewall", "IPS"],
    videoUrl: "#",
    thumbnail: "/thumbnails/lecture4.jpg",
  },
  {
    id: 5,
    title: "Lab: Cấu hình DHCP và DNS",
    description: "Thực hành cấu hình DHCP và DNS trên Windows Server",
    type: "lab",
    duration: "120 phút",
    date: "2026-06-20",
    views: 56,
    likes: 23,
    teacher: "Nguyễn Ngọc Thanh",
    tags: ["DHCP", "DNS", "Windows Server"],
    videoUrl: "#",
    thumbnail: "/thumbnails/lecture5.jpg",
  },
];

const categories = ["Tất cả", "Video", "Slide", "Lab", "Tài liệu"];
const tags = [
  "Mạng cơ bản",
  "VLAN",
  "Định tuyến",
  "Bảo mật",
  "CCNA",
  "DHCP",
  "DNS",
];

export default function LecturesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredLectures = lectures.filter((lecture) => {
    const matchesSearch =
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" ||
      lecture.type === selectedCategory.toLowerCase();
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => lecture.tags.includes(tag));
    return matchesSearch && matchesCategory && matchesTags;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
    );
    toast.success(
      favorites.includes(id) ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích",
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "slide":
        return FileText;
      case "lab":
        return Play;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video":
        return "from-red-500 to-red-600";
      case "slide":
        return "from-blue-500 to-blue-600";
      case "lab":
        return "from-green-500 to-green-600";
      default:
        return "from-gray-500 to-gray-600";
    }
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
            Bài Giảng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Video, slide và tài liệu bài giảng
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
              placeholder="Tìm kiếm bài giảng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Lọc
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <GridIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Loại bài giảng</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <Badge
                          key={cat}
                          variant={
                            selectedCategory === cat ? "default" : "outline"
                          }
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Thẻ</h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags.includes(tag) ? "secondary" : "outline"
                          }
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => {
                            setSelectedTags((prev) =>
                              prev.includes(tag)
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag],
                            );
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lectures Grid */}
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredLectures.map((lecture, index) => {
            const TypeIcon = getTypeIcon(lecture.type);
            const isFavorite = favorites.includes(lecture.id);
            return (
              <motion.div
                key={lecture.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-r ${getTypeColor(lecture.type)} flex items-center justify-center shadow-lg`}
                      >
                        <TypeIcon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                        onClick={() => toggleFavorite(lecture.id)}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs capitalize">
                        {lecture.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        {lecture.duration}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                      {lecture.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                      {lecture.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {lecture.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {lecture.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {lecture.likes}
                        </span>
                      </div>
                      <Button size="sm" className="gap-2">
                        <Play className="w-3 h-3" />
                        Xem ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredLectures.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Video className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy bài giảng
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
