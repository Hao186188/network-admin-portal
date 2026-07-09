// src/app/(routes)/announcements/components/AnnouncementFilters.tsx
// Vai trò: Bộ lọc và tìm kiếm

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Filter, Grid, List } from "lucide-react";

const categories = [
  "Tất cả",
  "Hệ thống",
  "Sự kiện",
  "Học tập",
  "Cảnh báo",
  "Cập nhật",
];

interface AnnouncementFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function AnnouncementFilters({
  selectedCategory,
  setSelectedCategory,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
}: AnnouncementFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-border/50 hover:border-cyan-500/30"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Lọc
          </Button>
        </div>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 pt-2 pb-4 border-t border-border/50">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:scale-105",
                  selectedCategory === cat &&
                    "bg-gradient-to-r from-cyan-500 to-blue-500",
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
