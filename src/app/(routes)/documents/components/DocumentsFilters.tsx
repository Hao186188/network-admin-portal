// src/app/(routes)/documents/components/DocumentsFilters.tsx
// FILTER PANEL - THÊM SUBJECTS

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Filter, Grid as GridIcon, List, X } from "lucide-react";

interface DocumentsFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  categories: string[];
  tags: string[];
  subjects: string[];
}

export function DocumentsFilters({
  selectedCategory,
  setSelectedCategory,
  selectedTags,
  setSelectedTags,
  viewMode,
  setViewMode,
  isFilterOpen,
  setIsFilterOpen,
  categories,
  tags,
  subjects,
}: DocumentsFiltersProps) {
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );
  };

  const clearFilters = () => {
    setSelectedCategory("Tất cả");
    setSelectedTags([]);
  };

  const hasActiveFilters =
    selectedCategory !== "Tất cả" || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "gap-2 border-white/10 hover:border-primary/50 transition-all",
            isFilterOpen && "border-primary/50 bg-primary/5",
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Lọc</span>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {selectedTags.length + (selectedCategory !== "Tất cả" ? 1 : 0)}
            </Badge>
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              isFilterOpen && "rotate-180",
            )}
          />
        </Button>

        <div className="flex-1" />

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

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white/80">Danh mục</h4>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-xs text-white/40 hover:text-white"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Xóa lọc
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Tất cả", ...categories].map((cat) => (
                        <Badge
                          key={cat}
                          variant={
                            selectedCategory === cat ? "default" : "outline"
                          }
                          className={cn(
                            "cursor-pointer hover:scale-105 transition-all duration-200",
                            selectedCategory === cat
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                              : "border-white/20 text-white/60 hover:border-primary/50 hover:text-white",
                          )}
                          onClick={() => setSelectedCategory(cat)}
                        >
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  {subjects.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white/80 mb-3">
                        Môn học
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subjects.slice(0, 10).map((subject) => (
                          <Badge
                            key={subject}
                            variant="outline"
                            className="border-white/10 text-white/40 text-xs"
                          >
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white/80 mb-3">
                        Thẻ phổ biến
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {tags.slice(0, 15).map((tag) => (
                          <Badge
                            key={tag}
                            variant={
                              selectedTags.includes(tag)
                                ? "secondary"
                                : "outline"
                            }
                            className={cn(
                              "cursor-pointer hover:scale-105 transition-all duration-200",
                              selectedTags.includes(tag)
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : "border-white/20 text-white/60 hover:border-purple-500/50 hover:text-white",
                            )}
                            onClick={() => toggleTag(tag)}
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
