// src/app/(routes)/assignments/components/AssignmentFilters.tsx
// Vai trò: Filter và search cho trang assignments

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
    ChevronDown,
    Filter,
    Grid as GridIcon,
    List,
    Search,
    X,
} from "lucide-react";

interface AssignmentFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (value: "grid" | "list") => void;
  assignments: any[];
}

const statuses = ["Tất cả", "pending", "submitted", "graded"];
const statusLabels: Record<string, string> = {
  pending: "Chưa nộp",
  submitted: "Đã nộp",
  graded: "Đã chấm",
};

export function AssignmentFilters({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  showFilters,
  setShowFilters,
  viewMode,
  setViewMode,
  assignments,
}: AssignmentFiltersProps) {
  const uniqueTypes = ["Tất cả", ...new Set(assignments.map((a) => a.type))];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm bài tập theo tên, mô tả hoặc môn học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
              onClick={() => setSearchQuery("")}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2 border-border/50 hover:border-primary/30 transition-all"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Lọc</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="transition-all duration-300"
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="transition-all duration-300"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-6 pt-2 pb-4 border-t border-border/50">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Trạng thái
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Badge
                      key={status}
                      variant={
                        selectedStatus === status ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-105",
                        selectedStatus === status
                          ? "bg-gradient-to-r from-primary to-secondary"
                          : "hover:border-primary/50",
                      )}
                      onClick={() => setSelectedStatus(status)}
                    >
                      {status === "Tất cả"
                        ? status
                        : statusLabels[status] || status}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Loại
                </label>
                <div className="flex flex-wrap gap-2">
                  {uniqueTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200 hover:scale-105",
                        selectedType === type
                          ? "bg-gradient-to-r from-purple-500 to-pink-500"
                          : "hover:border-primary/50",
                      )}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
