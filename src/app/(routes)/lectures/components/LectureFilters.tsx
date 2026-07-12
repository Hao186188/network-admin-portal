// src/app/(routes)/lectures/components/LectureFilters.tsx
// LECTURE FILTERS - FIX LỖI

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LectureFilter } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Grid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

const typeOptions = [
  { value: "all", label: "Tất cả", icon: "📚" },
  { value: "video", label: "Video", icon: "🎬" },
  { value: "slide", label: "Slide", icon: "📊" },
  { value: "lab", label: "Lab", icon: "💻" },
  { value: "document", label: "Tài liệu", icon: "📄" },
];

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "popular", label: "Phổ biến nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "most_liked", label: "Nhiều lượt thích" },
];

interface LectureFiltersProps {
  filter: LectureFilter;
  setFilter: (filter: LectureFilter) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  availableTags: string[];
  totalResults?: number;
}

export function LectureFilters({
  filter,
  setFilter,
  viewMode,
  setViewMode,
  availableTags,
  totalResults,
}: LectureFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const updateFilter = (key: keyof LectureFilter, value: any) => {
    setFilter({ ...filter, [key]: value });
  };

  const clearFilters = () => {
    setFilter({
      search: "",
      type: "all",
      tags: [],
      subject: "",
      status: "approved",
      sortBy: "newest",
    });
  };

  const toggleTag = (tag: string) => {
    const currentTags = filter.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t: string) => t !== tag)
      : [...currentTags, tag];
    updateFilter("tags", newTags);
  };

  const hasActiveFilters =
    filter.search ||
    filter.type !== "all" ||
    (filter.tags && filter.tags.length > 0) ||
    filter.subject;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.type !== "all") count++;
    if (filter.tags && filter.tags.length > 0) count += filter.tags.length;
    if (filter.subject) count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search - Desktop */}
        <div className="relative flex-1 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài giảng theo tên, mô tả, giảng viên..."
            value={filter.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 pr-10 h-11"
          />
          {filter.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search - Mobile */}
        <div className="sm:hidden">
          <Button
            variant="outline"
            className="w-full gap-2 justify-start text-muted-foreground"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search className="w-4 h-4" />
            {filter.search || "Tìm kiếm bài giảng..."}
            {filter.search && (
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {filter.search.length}
              </span>
            )}
          </Button>

          <AnimatePresence>
            {showMobileSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={filter.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-10 pr-10 h-11"
                    autoFocus
                  />
                  {filter.search && (
                    <button
                      onClick={() => updateFilter("search", "")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          {/* Filter Button */}
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 h-11 relative",
              showFilters && "bg-primary/10 border-primary/30",
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Lọc</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </Button>

          {/* Sort */}
          <Select
            value={filter.sortBy}
            onValueChange={(value: string) => updateFilter("sortBy", value)}
          >
            <SelectTrigger className="w-[130px] h-11">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex gap-1 border rounded-lg p-0.5">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-md"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className="h-9 w-9 rounded-md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border/50 bg-muted/30 space-y-4">
              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Loại bài giảng
                </label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={
                        filter.type === option.value ? "default" : "outline"
                      }
                      className={cn(
                        "cursor-pointer hover:scale-105 transition-transform px-3 py-1.5",
                        filter.type === option.value &&
                          "bg-gradient-to-r from-primary to-secondary",
                      )}
                      onClick={() => updateFilter("type", option.value)}
                    >
                      {option.icon} {option.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Thẻ
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant={
                          filter.tags?.includes(tag) ? "secondary" : "outline"
                        }
                        className={cn(
                          "cursor-pointer hover:scale-105 transition-transform px-3 py-1.5",
                          filter.tags?.includes(tag) && "bg-secondary/50",
                        )}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-foreground"
                    onClick={clearFilters}
                  >
                    <X className="w-4 h-4" />
                    Xóa tất cả bộ lọc
                  </Button>
                  {totalResults !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {totalResults} kết quả
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground">Đang lọc:</span>
          {filter.type !== "all" && (
            <Badge variant="secondary" className="text-xs gap-1">
              {typeOptions.find((t) => t.value === filter.type)?.icon}{" "}
              {typeOptions.find((t) => t.value === filter.type)?.label}
              <button
                onClick={() => updateFilter("type", "all")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filter.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs gap-1">
              #{tag}
              <button
                onClick={() => toggleTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filter.search && (
            <Badge variant="secondary" className="text-xs gap-1">
              🔍 "{filter.search}"
              <button
                onClick={() => updateFilter("search", "")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filter.subject && (
            <Badge variant="secondary" className="text-xs gap-1">
              📚 {filter.subject}
              <button
                onClick={() => updateFilter("subject", "")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
