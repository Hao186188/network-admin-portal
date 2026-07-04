// src/app/(routes)/vm/page.tsx
// Vai trò: Quản lý và chia sẻ các máy ảo (VM) đã cấu hình sẵn

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Bookmark,
    Download,
    Eye,
    Filter,
    Grid as GridIcon,
    Heart,
    List,
    Search,
    Server,
    Star
} from "lucide-react";
import { useState } from "react";

const vmFiles = [
  {
    id: 1,
    title: "Ubuntu Server 24.04 VM",
    description: "Máy ảo Ubuntu Server 24.04 với cấu hình cơ bản",
    type: "vm",
    size: "8.5 GB",
    date: "2026-06-20",
    downloads: 89,
    views: 210,
    rating: 4.8,
    tags: ["Ubuntu", "Server", "VM"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 2,
    title: "Windows Server 2022 VM",
    description: "Máy ảo Windows Server 2022 với AD và DNS",
    type: "vm",
    size: "12.4 GB",
    date: "2026-06-18",
    downloads: 67,
    views: 156,
    rating: 4.7,
    tags: ["Windows Server", "AD", "DNS"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 3,
    title: "Kali Linux VM",
    description: "Máy ảo Kali Linux với các công cụ bảo mật",
    type: "vm",
    size: "9.8 GB",
    date: "2026-06-15",
    downloads: 56,
    views: 98,
    rating: 4.9,
    tags: ["Kali", "Security", "VM"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 4,
    title: "CentOS 9 VM",
    description: "Máy ảo CentOS 9 cho môi trường Server",
    type: "vm",
    size: "7.6 GB",
    date: "2026-06-12",
    downloads: 34,
    views: 67,
    rating: 4.5,
    tags: ["CentOS", "Server", "VM"],
    author: "Nguyễn Ngọc Thanh",
  },
];

export default function VMPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleDownload = (title: string) => {
    toast.success(`Đang tải xuống: ${title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Kho VM
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tổng hợp các máy ảo đã cấu hình sẵn
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm VM..."
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vmFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Server className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {file.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {file.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {file.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {file.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {file.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {file.rating}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownload(file.title)}
                    >
                      <Download className="w-3 h-3" />
                      Tải
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
