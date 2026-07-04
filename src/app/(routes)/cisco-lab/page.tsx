// src/app/(routes)/cisco-lab/page.tsx
// Vai trò: Chia sẻ và quản lý các file cấu hình Cisco

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
    FileText,
    Filter,
    Grid as GridIcon,
    Heart,
    List,
    Search,
    Star
} from "lucide-react";
import { useState } from "react";

const ciscoFiles = [
  {
    id: 1,
    title: "Cấu hình VLAN trên Switch 2960",
    description: "File cấu hình VLAN và trunking trên Switch Cisco 2960",
    type: "config",
    size: "2.3 KB",
    date: "2026-06-20",
    downloads: 45,
    views: 128,
    rating: 4.8,
    tags: ["VLAN", "Switch", "Trunking"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 2,
    title: "Cấu hình OSPF trên Router",
    description: "File cấu hình OSPF với các area và authentication",
    type: "config",
    size: "3.1 KB",
    date: "2026-06-18",
    downloads: 32,
    views: 95,
    rating: 4.5,
    tags: ["OSPF", "Routing", "Authentication"],
    author: "Nguyễn Ngọc Thanh",
  },
  {
    id: 3,
    title: "Lab BGP với 3 Router",
    description: "Bài lab BGP với cấu hình eBGP và iBGP",
    type: "lab",
    size: "4.5 KB",
    date: "2026-06-15",
    downloads: 28,
    views: 67,
    rating: 4.3,
    tags: ["BGP", "eBGP", "iBGP"],
    author: "Nguyễn Ngọc Thanh",
  },
];

export default function CiscoLabPage() {
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
            Cisco Lab
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Chia sẻ file cấu hình và lab Cisco
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm file Cisco..."
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
          {ciscoFiles.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                      <FileText className="w-6 h-6 text-white" />
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
