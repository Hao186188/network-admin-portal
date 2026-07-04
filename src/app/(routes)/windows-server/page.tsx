// src/app/(routes)/windows-server/page.tsx
// Vai trò: Chia sẻ tài liệu và hướng dẫn Windows Server

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

const windowsResources = [
  {
    id: 1,
    title: "Cài đặt và cấu hình AD DS",
    description: "Hướng dẫn cài đặt Active Directory Domain Services",
    type: "guide",
    size: "5.6 KB",
    date: "2026-06-20",
    downloads: 67,
    views: 145,
    rating: 4.8,
    tags: ["AD DS", "Windows Server", "Active Directory"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 2,
    title: "Cấu hình DNS và DHCP",
    description: "Hướng dẫn cấu hình DNS và DHCP trên Windows Server",
    type: "guide",
    size: "4.2 KB",
    date: "2026-06-18",
    downloads: 89,
    views: 178,
    rating: 4.7,
    tags: ["DNS", "DHCP", "Windows Server"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 3,
    title: "PowerShell - Quản lý Server",
    description: "Script PowerShell quản lý Windows Server",
    type: "script",
    size: "3.5 KB",
    date: "2026-06-15",
    downloads: 45,
    views: 98,
    rating: 4.6,
    tags: ["PowerShell", "Management", "Script"],
    author: "Nguyễn Ngọc Thanh",
  },
];

export default function WindowsServerPage() {
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
            Windows Server
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tài liệu và hướng dẫn Windows Server
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm tài nguyên Windows Server..."
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
          {windowsResources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
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
