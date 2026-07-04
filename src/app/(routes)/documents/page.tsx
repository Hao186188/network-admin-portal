// src/app(routes)/documents/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  Download,
  Eye,
  File,
  FileText,
  Filter,
  Grid as GridIcon,
  Heart,
  List,
  Search,
  Star
} from "lucide-react";
import { useState } from "react";

// Sử dụng File cho các loại file không có icon riêng
const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return File;
    case "ppt":
      return File;
    case "doc":
      return FileText;
    case "xls":
      return File;
    default:
      return File;
  }
};

const documents = [
  {
    id: 1,
    title: "Giáo trình Quản trị Mạng Nâng cao",
    description:
      "Tài liệu chi tiết về quản trị mạng với các chủ đề từ cơ bản đến nâng cao",
    type: "pdf",
    size: "12.5 MB",
    date: "15/06/2026",
    downloads: 45,
    views: 128,
    rating: 4.8,
    tags: ["Quản trị mạng", "CCNA", "Cisco"],
    category: "Giáo trình",
  },
  {
    id: 2,
    title: "Bài giảng Mạng máy tính - Tuần 5",
    description: "Bài giảng về cấu trúc mạng và các giao thức cơ bản",
    type: "ppt",
    size: "8.2 MB",
    date: "12/06/2026",
    downloads: 32,
    views: 95,
    rating: 4.5,
    tags: ["Mạng máy tính", "OSI", "TCP/IP"],
    category: "Bài giảng",
  },
  {
    id: 3,
    title: "Hướng dẫn cài đặt Cisco Packet Tracer",
    description:
      "Hướng dẫn chi tiết từng bước cài đặt và cấu hình Packet Tracer",
    type: "pdf",
    size: "3.1 MB",
    date: "10/06/2026",
    downloads: 78,
    views: 210,
    rating: 4.9,
    tags: ["Packet Tracer", "Hướng dẫn", "Cisco"],
    category: "Hướng dẫn",
  },
  {
    id: 4,
    title: "Bài tập Lab Mạng 3 - Tuần 4",
    description: "Bài tập thực hành về VLAN và định tuyến",
    type: "doc",
    size: "2.8 MB",
    date: "08/06/2026",
    downloads: 28,
    views: 67,
    rating: 4.3,
    tags: ["Lab", "VLAN", "Định tuyến"],
    category: "Bài tập",
  },
  {
    id: 5,
    title: "Tài liệu ôn tập thi giữa kỳ",
    description: "Tổng hợp kiến thức trọng tâm cho kỳ thi giữa kỳ",
    type: "pdf",
    size: "5.6 MB",
    date: "05/06/2026",
    downloads: 56,
    views: 156,
    rating: 4.6,
    tags: ["Ôn tập", "Thi giữa kỳ", "Mạng 3"],
    category: "Ôn tập",
  },
];

const categories = [
  "Tất cả",
  "Giáo trình",
  "Bài giảng",
  "Hướng dẫn",
  "Bài tập",
  "Ôn tập",
];
const tags = [
  "Quản trị mạng",
  "CCNA",
  "Cisco",
  "Mạng máy tính",
  "TCP/IP",
  "Packet Tracer",
  "Lab",
  "VLAN",
];

export default function DocumentsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || doc.category === selectedCategory;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => doc.tags.includes(tag));
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

  const handleDownload = (title: string) => {
    toast.success(`Đang tải xuống: ${title}`);
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
            Kho Tài Liệu
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Khám phá và tải xuống tài liệu học tập
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
              placeholder="Tìm kiếm tài liệu..."
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
              aria-label="Grid view"
            >
              <GridIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3">Danh mục</h4>
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
                              selectedTags.includes(tag)
                                ? "secondary"
                                : "outline"
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
        </AnimatePresence>

        {/* Documents Grid */}
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredDocuments.map((doc, index) => {
              const FileIcon = getFileIcon(doc.type);
              const isFavorite = favorites.includes(doc.id);
              return (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg`}
                        >
                          <FileIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(doc.id)}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                        {doc.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {doc.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {doc.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {doc.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {doc.rating}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleDownload(doc.title)}
                        >
                          <Download className="w-3 h-3" />
                          Tải xuống
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <File className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy tài liệu
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
