// src/app/(routes)/source-code/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Check,
    Code,
    Copy,
    Download,
    FileCode,
    GitFork,
    Heart,
    Search,
    Star
} from "lucide-react";
import { useState } from "react";

const sourceCodes = [
  {
    id: 1,
    name: "Python Script - Network Scanner",
    description: "Script quét mạng tự động phát hiện thiết bị",
    language: "Python",
    author: "Võ Nhật Hào",
    stars: 25,
    forks: 10,
    views: 150,
    downloads: 45,
    tags: ["Python", "Network", "Scanner"],
    size: "15 KB",
    updated: "2026-06-20",
  },
  {
    id: 2,
    name: "Bash Script - Auto Backup",
    description: "Script tự động backup cấu hình switch/router",
    language: "Bash",
    author: "Võ Nhật Hào",
    stars: 18,
    forks: 7,
    views: 98,
    downloads: 32,
    tags: ["Bash", "Backup", "Network"],
    size: "8 KB",
    updated: "2026-06-18",
  },
  {
    id: 3,
    name: "PowerShell - AD Management",
    description: "Script quản lý Active Directory tự động",
    language: "PowerShell",
    author: "Võ Nhật Hào",
    stars: 20,
    forks: 8,
    views: 112,
    downloads: 38,
    tags: ["PowerShell", "Active Directory", "Windows"],
    size: "12 KB",
    updated: "2026-06-15",
  },
];

const languages = [
  "Tất cả",
  "Python",
  "JavaScript",
  "Bash",
  "PowerShell",
  "TypeScript",
];

export default function SourceCodePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Tất cả");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredCodes = sourceCodes.filter((code) => {
    const matchesSearch =
      code.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage =
      selectedLanguage === "Tất cả" || code.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id],
    );
    toast.success(
      favorites.includes(id) ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích",
    );
  };

  const handleCopy = (id: number) => {
    setCopiedId(id);
    toast.success("Đã sao chép link");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (name: string) => {
    toast.success(`Đang tải xuống: ${name}`);
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
              Source Code
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Chia sẻ và tải xuống mã nguồn mở
            </p>
          </div>
          <Button size="lg" className="gap-2">
            <Code className="w-4 h-4" />
            Đăng mã nguồn
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
              placeholder="Tìm kiếm source code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Badge
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Source Code Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCodes.map((code, index) => {
            const isFavorite = favorites.includes(code.id);
            return (
              <motion.div
                key={code.id}
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
                          <FileCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {code.name}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {code.language}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleFavorite(code.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleCopy(code.id)}
                        >
                          {copiedId === code.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {code.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {code.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {code.stars}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3 h-3" />
                          {code.forks}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {code.downloads}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={() => handleDownload(code.name)}
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
        </motion.div>

        {/* Empty State */}
        {filteredCodes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Code className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy source code
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hãy đăng source code để chia sẻ với cộng đồng
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
