// src/app/(routes)/projects/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Bookmark,
    Code,
    Eye,
    Filter,
    GitFork,
    Globe,
    Grid as GridIcon,
    Heart,
    LinkIcon,
    List,
    Search,
    Star,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Custom social icons using generic icons
const socialIcons = {
  facebook: LinkIcon,
  github: LinkIcon,
  twitter: LinkIcon,
  youtube: LinkIcon,
  linkedin: LinkIcon,
};

const projects = [
  {
    id: 1,
    name: "Hệ thống quản lý mạng",
    description: "Ứng dụng quản lý thiết bị mạng với React và Node.js",
    author: "Võ Nhật Hào",
    language: "JavaScript",
    stars: 15,
    forks: 8,
    views: 120,
    tags: ["React", "Node.js", "MongoDB"],
    lastUpdated: "2026-06-20",
    url: "#",
    demo: "#",
  },
  {
    id: 2,
    name: "Network Automation Tool",
    description: "Công cụ tự động hóa cấu hình mạng với Python",
    author: "Võ Nhật Hào",
    language: "Python",
    stars: 10,
    forks: 5,
    views: 85,
    tags: ["Python", "Automation", "Netmiko"],
    lastUpdated: "2026-06-18",
    url: "#",
    demo: "#",
  },
  {
    id: 3,
    name: "Cisco Config Generator",
    description: "Tạo cấu hình Cisco tự động từ template",
    author: "Võ Nhật Hào",
    language: "Python",
    stars: 8,
    forks: 3,
    views: 56,
    tags: ["Python", "Cisco", "Automation"],
    lastUpdated: "2026-06-15",
    url: "#",
    demo: "#",
  },
  {
    id: 4,
    name: "Network Topology Mapper",
    description: "Vẽ sơ đồ mạng tự động từ dữ liệu LLDP/CDP",
    author: "Võ Nhật Hào",
    language: "TypeScript",
    stars: 12,
    forks: 6,
    views: 94,
    tags: ["TypeScript", "Network", "Topology"],
    lastUpdated: "2026-06-12",
    url: "#",
    demo: "#",
  },
];

const languages = [
  "Tất cả",
  "JavaScript",
  "Python",
  "TypeScript",
  "Java",
  "C++",
];
const tags = [
  "React",
  "Node.js",
  "Python",
  "Automation",
  "Cisco",
  "Network",
  "TypeScript",
];

export default function ProjectsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Tất cả");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "Tất cả" || project.language === selectedLanguage;
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => project.tags.includes(tag));
    return matchesSearch && matchesLanguage && matchesTags;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
    toast.success(
      favorites.includes(id) ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích",
    );
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
              Dự Án
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Chia sẻ và khám phá các dự án học tập
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Code className="w-4 h-4" />
            Tạo dự án mới
          </Button>
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
              placeholder="Tìm kiếm dự án..."
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
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProjects.map((project, index) => {
            const isFavorite = favorites.includes(project.id);
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                          <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            bởi {project.author}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleFavorite(project.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">
                        {project.language}
                      </Badge>
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {project.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {project.forks}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {project.views}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={project.url} target="_blank">
                          <Button size="sm" variant="outline" className="gap-1">
                            <socialIcons.github className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link href={project.demo} target="_blank">
                          <Button size="sm" variant="outline" className="gap-1">
                            <Globe className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Code className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy dự án</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy tạo dự án mới để chia sẻ với cộng đồng
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
