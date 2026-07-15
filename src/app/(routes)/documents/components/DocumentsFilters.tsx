// src/app/(routes)/documents/components/DocumentsFilters.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileCode,
  Filter,
  Grid as GridIcon,
  Hash,
  Layers,
  List,
  X
} from "lucide-react";

interface DocumentsFiltersProps {
  // Categories
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Subjects
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;

  // File Types
  selectedFileType: string;
  setSelectedFileType: (type: string) => void;

  // Tags
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;

  // View Mode
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;

  // UI State
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;

  // Data
  categories: string[];
  tags: string[];
  subjects: string[];
  fileTypes?: string[];

  // Optional: Semester filter
  selectedSemester?: string;
  setSelectedSemester?: (semester: string) => void;
  semesters?: string[];
}

export function DocumentsFilters({
  selectedCategory,
  setSelectedCategory,
  selectedSubject,
  setSelectedSubject,
  selectedFileType,
  setSelectedFileType,
  selectedTags,
  setSelectedTags,
  viewMode,
  setViewMode,
  isFilterOpen,
  setIsFilterOpen,
  categories,
  tags,
  subjects,
  fileTypes = ["pdf", "docx", "pptx", "xlsx", "zip", "rar"],
  selectedSemester,
  setSelectedSemester,
  semesters = [],
}: DocumentsFiltersProps) {
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory("Tất cả");
    setSelectedSubject("Tất cả");
    setSelectedFileType("Tất cả");
    setSelectedTags([]);
    if (setSelectedSemester && selectedSemester !== undefined) {
      setSelectedSemester("Tất cả");
    }
  };

  const hasActiveFilters =
    selectedCategory !== "Tất cả" ||
    selectedSubject !== "Tất cả" ||
    selectedFileType !== "Tất cả" ||
    selectedTags.length > 0 ||
    (selectedSemester && selectedSemester !== "Tất cả");

  const getFilterCount = () => {
    let count = 0;
    if (selectedCategory !== "Tất cả") count++;
    if (selectedSubject !== "Tất cả") count++;
    if (selectedFileType !== "Tất cả") count++;
    count += selectedTags.length;
    if (selectedSemester && selectedSemester !== "Tất cả") count++;
    return count;
  };

  // Map file type to display name and color
  const getFileTypeDisplay = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      pdf: { label: "PDF", color: "text-red-400" },
      docx: { label: "DOCX", color: "text-blue-400" },
      doc: { label: "DOC", color: "text-blue-400" },
      xlsx: { label: "XLSX", color: "text-green-400" },
      xls: { label: "XLS", color: "text-green-400" },
      pptx: { label: "PPTX", color: "text-orange-400" },
      ppt: { label: "PPT", color: "text-orange-400" },
      zip: { label: "ZIP", color: "text-yellow-400" },
      rar: { label: "RAR", color: "text-yellow-400" },
      "7z": { label: "7Z", color: "text-yellow-400" },
      txt: { label: "TXT", color: "text-gray-400" },
      md: { label: "MD", color: "text-purple-400" },
    };
    return (
      map[type.toLowerCase()] || {
        label: type.toUpperCase(),
        color: "text-white/60",
      }
    );
  };

  return (
    <div className="space-y-4 w-full relative z-20">
      {/* Thanh điều khiển chính */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "gap-2 border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all",
              isFilterOpen &&
                "border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:text-cyan-400 hover:bg-cyan-500/20",
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Bộ lọc nâng cao</span>
            {hasActiveFilters && (
              <Badge className="ml-1 bg-cyan-500/20 text-cyan-400 border-0 px-1.5 py-0 text-[10px]">
                {getFilterCount()}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "w-3 h-3 transition-transform duration-200",
                isFilterOpen && "rotate-180",
              )}
            />
          </Button>

          {/* Hiển thị nhanh số lượng bộ lọc đang hoạt động */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-red-400 hover:text-red-300 gap-1 px-2 h-8 hover:bg-red-500/10 rounded-lg"
            >
              <X className="w-3 h-3" /> Xóa tất cả
            </Button>
          )}
        </div>

        {/* Chuyển đổi View */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 self-end sm:self-auto">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-md p-0 text-white/50",
              viewMode === "grid" &&
                "bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 shadow-sm",
            )}
            onClick={() => setViewMode("grid")}
          >
            <GridIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-md p-0 text-white/50",
              viewMode === "list" &&
                "bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 shadow-sm",
            )}
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Bảng bộ lọc mở rộng */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Card className="bg-slate-950/80 backdrop-blur-md border-white/5 shadow-2xl relative">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

              <CardContent className="p-5 md:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Cột 1: Danh mục */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" /> Danh mục
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["Tất cả", ...categories.slice(0, 8)].map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-lg border transition-all text-left font-medium",
                            selectedCategory === category
                              ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                              : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white",
                          )}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cột 2: Môn học */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Môn
                      học
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["Tất cả", ...subjects.slice(0, 8)].map((subject) => (
                        <button
                          key={subject}
                          onClick={() => setSelectedSubject(subject)}
                          className={cn(
                            "text-xs px-3 py-1.5 rounded-lg border transition-all text-left font-medium",
                            selectedSubject === subject
                              ? "bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                              : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white",
                          )}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cột 3: Định dạng File */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-emerald-400" /> Định
                      dạng
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["Tất cả", ...fileTypes].map((type) => {
                        const display = getFileTypeDisplay(type);
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedFileType(type)}
                            className={cn(
                              "text-xs px-3.5 py-1.5 rounded-lg border transition-all font-mono tracking-wider",
                              selectedFileType === type
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                                : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white",
                            )}
                          >
                            <span className={display.color}>
                              {display.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cột 4: Học kỳ (Optional) */}
                  {semesters.length > 0 && setSelectedSemester && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-pink-400" /> Học
                        kỳ
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {["Tất cả", ...semesters].map((semester) => (
                          <button
                            key={semester}
                            onClick={() => setSelectedSemester(semester)}
                            className={cn(
                              "text-xs px-3 py-1.5 rounded-lg border transition-all text-left font-medium",
                              selectedSemester === semester
                                ? "bg-pink-500/20 border-pink-500/40 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                                : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white",
                            )}
                          >
                            {semester}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags - Full width */}
                {tags.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-amber-400" /> Thẻ từ
                        khóa
                      </h4>
                      {selectedTags.length > 0 && (
                        <span className="text-[10px] text-amber-400/60">
                          Đã chọn {selectedTags.length} thẻ
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                      {tags.slice(0, 25).map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <Badge
                            key={tag}
                            variant={isSelected ? "secondary" : "outline"}
                            className={cn(
                              "cursor-pointer px-2.5 py-1 text-[11px] font-light transition-all duration-200 rounded-md",
                              isSelected
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                : "border-white/10 bg-white/5 text-white/50 hover:border-amber-500/30 hover:text-amber-300",
                            )}
                            onClick={() => toggleTag(tag)}
                          >
                            #{tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div className="pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                    <span className="text-[10px] text-white/40 font-mono uppercase tracking-wider mr-1 self-center">
                      Đang lọc:
                    </span>
                    {selectedCategory !== "Tất cả" && (
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]">
                        {selectedCategory}
                      </Badge>
                    )}
                    {selectedSubject !== "Tất cả" && (
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]">
                        {selectedSubject}
                      </Badge>
                    )}
                    {selectedFileType !== "Tất cả" && (
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] uppercase">
                        {selectedFileType}
                      </Badge>
                    )}
                    {selectedSemester && selectedSemester !== "Tất cả" && (
                      <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/20 text-[10px]">
                        {selectedSemester}
                      </Badge>
                    )}
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
