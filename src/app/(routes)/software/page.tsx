// src/app/(routes)/software/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
    Cloud,
    Database,
    Download,
    Filter,
    Grid as GridIcon,
    List,
    Package,
    Search,
    Server,
    Shield,
    Star,
    Zap
} from "lucide-react";
import { useState } from "react";

const software = [
  {
    id: 1,
    name: "Cisco Packet Tracer",
    description: "Công cụ mô phỏng mạng hàng đầu của Cisco",
    category: "Mô phỏng",
    version: "8.2.1",
    size: "245 MB",
    downloads: 156,
    rating: 4.9,
    tags: ["Cisco", "Mô phỏng", "Mạng"],
    icon: Server,
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "VMware Workstation Pro",
    description: "Phần mềm ảo hóa mạnh mẽ cho môi trường lab",
    category: "Ảo hóa",
    version: "17.5.1",
    size: "580 MB",
    downloads: 98,
    rating: 4.8,
    tags: ["VM", "Ảo hóa", "Lab"],
    icon: Server,
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    name: "Wireshark",
    description: "Công cụ phân tích gói tin mạng chuyên nghiệp",
    category: "Phân tích",
    version: "4.2.3",
    size: "85 MB",
    downloads: 234,
    rating: 4.9,
    tags: ["Network", "Analysis", "Packet"],
    icon: Shield,
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    name: "GNS3",
    description: "Trình mô phỏng mạng phức tạp với nhiều thiết bị",
    category: "Mô phỏng",
    version: "2.2.45",
    size: "120 MB",
    downloads: 67,
    rating: 4.7,
    tags: ["Mô phỏng", "Lab", "Cisco"],
    icon: Zap,
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 5,
    name: "VirtualBox",
    description: "Phần mềm ảo hóa mã nguồn mở phổ biến",
    category: "Ảo hóa",
    version: "7.0.14",
    size: "110 MB",
    downloads: 189,
    rating: 4.6,
    tags: ["VM", "Open Source", "Ảo hóa"],
    icon: Database,
    color: "from-red-500 to-red-600",
  },
  {
    id: 6,
    name: "Ubuntu Desktop",
    description: "Hệ điều hành Linux phổ biến nhất cho máy trạm",
    category: "OS",
    version: "24.04 LTS",
    size: "4.8 GB",
    downloads: 145,
    rating: 4.8,
    tags: ["Linux", "OS", "Ubuntu"],
    icon: Cloud,
    color: "from-amber-500 to-amber-600",
  },
];

const categories = [
  "Tất cả",
  "Mô phỏng",
  "Ảo hóa",
  "Phân tích",
  "OS",
  "Công cụ",
];
const platforms = ["Windows", "Linux", "macOS", "Cross-platform"];

export default function SoftwarePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredSoftware = software.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Kho Phần Mềm
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Công cụ và phần mềm chuyên ngành cho học tập
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
              placeholder="Tìm kiếm phần mềm..."
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
                    <h4 className="font-medium mb-3">Nền tảng</h4>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant={
                            selectedPlatform === platform
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedPlatform(platform)}
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Software Grid */}
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredSoftware.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      v{item.version}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {item.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {item.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {item.size}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDownload(item.name)}
                    >
                      <Download className="w-3 h-3" />
                      Tải xuống
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredSoftware.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Không tìm thấy phần mềm
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
