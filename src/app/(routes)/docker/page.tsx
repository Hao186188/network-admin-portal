// src/app/(routes)/docker/page.tsx
// Vai trò: Chia sẻ tài liệu và hướng dẫn Docker

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Bookmark,
    Box,
    Download,
    Eye,
    Filter,
    Grid as GridIcon,
    Heart,
    List,
    Search,
    Star
} from "lucide-react";
import { useState } from "react";

const dockerResources = [
  {
    id: 1,
    title: "Docker Compose - LAMP Stack",
    description: "File docker-compose cho LAMP Stack",
    type: "compose",
    size: "1.2 KB",
    date: "2026-06-20",
    downloads: 45,
    views: 98,
    rating: 4.8,
    tags: ["Docker", "Compose", "LAMP"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 2,
    title: "Dockerfile - Node.js App",
    description: "Dockerfile cho ứng dụng Node.js",
    type: "dockerfile",
    size: "0.8 KB",
    date: "2026-06-18",
    downloads: 34,
    views: 67,
    rating: 4.7,
    tags: ["Docker", "Node.js", "Dockerfile"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 3,
    title: "Hướng dẫn Docker Networking",
    description: "Cấu hình network trong Docker",
    type: "guide",
    size: "3.5 KB",
    date: "2026-06-15",
    downloads: 56,
    views: 112,
    rating: 4.6,
    tags: ["Docker", "Network", "Guide"],
    author: "Nguyễn Ngọc Thanh",
  },
];

export default function DockerPage() {
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
            Docker
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tài liệu và hướng dẫn Docker
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm tài nguyên Docker..."
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
          {dockerResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
                      <Box className="w-6 h-6 text-white" />
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
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {resource.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownload(resource.title)}
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
