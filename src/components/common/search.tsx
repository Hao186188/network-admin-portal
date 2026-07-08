// src/components/common/search.tsx
// Vai trò: Search bar với kết quả - DÙNG DỮ LIỆU THẬT

"use client";

import { Input } from "@/components/ui/input";
import { useIsMobile, useIsTablet } from "@/hooks/use-media-query";
import { supabase } from "@/lib/db/supabase-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  FileText,
  Folder,
  Search as SearchIcon,
  Users,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type:
    | "document"
    | "lecture"
    | "project"
    | "announcement"
    | "course"
    | "assignment"
    | "user";
  href: string;
  icon?: React.ReactNode;
  category?: string;
}

const getIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "document":
      return FileText;
    case "lecture":
      return Video;
    case "project":
      return Folder;
    case "announcement":
      return Bell;
    case "course":
      return BookOpen;
    case "assignment":
      return Award;
    case "user":
      return Users;
    default:
      return FileText;
  }
};

const getTypeLabel = (type: SearchResult["type"]) => {
  switch (type) {
    case "document":
      return "Tài liệu";
    case "lecture":
      return "Bài giảng";
    case "project":
      return "Dự án";
    case "announcement":
      return "Thông báo";
    case "course":
      return "Môn học";
    case "assignment":
      return "Bài tập";
    case "user":
      return "Người dùng";
    default:
      return "Khác";
  }
};

const getTypeColor = (type: SearchResult["type"]) => {
  switch (type) {
    case "document":
      return "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20";
    case "lecture":
      return "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20";
    case "project":
      return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
    case "announcement":
      return "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20";
    case "course":
      return "bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20";
    case "assignment":
      return "bg-red-500/10 text-red-500 dark:bg-red-500/20";
    case "user":
      return "bg-pink-500/10 text-pink-500 dark:bg-pink-500/20";
    default:
      return "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20";
  }
};

const SearchSkeleton = () => (
  <div className="p-4 space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 animate-pulse">
        <div className="w-8 h-8 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-3 w-1/2 bg-muted rounded" />
        </div>
        <div className="h-5 w-12 bg-muted rounded-full" />
      </div>
    ))}
  </div>
);

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [debouncedQuery] = useDebounce(query, 300);
  const router = useRouter();

  // Load recent searches từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {
      console.error("Error loading recent searches:", e);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback(
    (searchTerm: string) => {
      try {
        const updated = [
          searchTerm,
          ...recentSearches.filter((s) => s !== searchTerm),
        ].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      } catch (e) {
        console.error("Error saving recent search:", e);
      }
    },
    [recentSearches],
  );

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  // Search function - DÙNG DỮ LIỆU THẬT
  const performSearch = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchQuery = searchTerm.trim().toLowerCase();
      const results: SearchResult[] = [];

      // 1. Tìm kiếm trong announcements
      const { data: announcements } = await supabase
        .from("announcements")
        .select("id, title, content, category")
        .ilike("title", `%${searchQuery}%`)
        .limit(3);

      if (announcements) {
        announcements.forEach((item) => {
          results.push({
            id: `announcement-${item.id}`,
            title: item.title,
            description: item.content?.substring(0, 100) || "",
            type: "announcement",
            href: `/announcements/${item.id}`,
            category: item.category,
          });
        });
      }

      // 2. Tìm kiếm trong assignments
      const { data: assignments } = await supabase
        .from("assignments")
        .select("id, title, description, subject, type")
        .ilike("title", `%${searchQuery}%`)
        .limit(3);

      if (assignments) {
        assignments.forEach((item) => {
          results.push({
            id: `assignment-${item.id}`,
            title: item.title,
            description: item.description || item.subject || "",
            type: "assignment",
            href: `/assignments/${item.id}`,
            category: item.type,
          });
        });
      }

      // 3. Tìm kiếm trong courses
      const { data: courses } = await supabase
        .from("courses")
        .select("id, name, code, description")
        .ilike("name", `%${searchQuery}%`)
        .limit(3);

      if (courses) {
        courses.forEach((item) => {
          results.push({
            id: `course-${item.id}`,
            title: item.name,
            description: item.code + " - " + (item.description || ""),
            type: "course",
            href: `/courses/${item.id}`,
            category: item.code,
          });
        });
      }

      // 4. Tìm kiếm trong users
      const { data: users } = await supabase
        .from("users")
        .select("id, name, email, role")
        .ilike("name", `%${searchQuery}%`)
        .limit(2);

      if (users) {
        users.forEach((item) => {
          results.push({
            id: `user-${item.id}`,
            title: item.name,
            description: item.email + " - " + (item.role || ""),
            type: "user",
            href: `/profile/${item.id}`,
            category: item.role,
          });
        });
      }

      // 5. Tìm kiếm trong documents (nếu có bảng)
      try {
        const { data: documents } = await supabase
          .from("documents")
          .select("id, title, description, type")
          .ilike("title", `%${searchQuery}%`)
          .limit(2);

        if (documents) {
          documents.forEach((item) => {
            results.push({
              id: `document-${item.id}`,
              title: item.title,
              description: item.description || "",
              type: "document",
              href: `/documents/${item.id}`,
              category: item.type,
            });
          });
        }
      } catch (e) {
        // Bảng documents chưa có
      }

      // 6. Tìm kiếm trong lectures (nếu có bảng)
      try {
        const { data: lectures } = await supabase
          .from("lectures")
          .select("id, title, description, subject")
          .ilike("title", `%${searchQuery}%`)
          .limit(2);

        if (lectures) {
          lectures.forEach((item) => {
            results.push({
              id: `lecture-${item.id}`,
              title: item.title,
              description: item.description || item.subject || "",
              type: "lecture",
              href: `/lectures/${item.id}`,
              category: item.subject,
            });
          });
        }
      } catch (e) {
        // Bảng lectures chưa có
      }

      // 7. Tìm kiếm trong projects (nếu có bảng)
      try {
        const { data: projects } = await supabase
          .from("projects")
          .select("id, name, description, status")
          .ilike("name", `%${searchQuery}%`)
          .limit(2);

        if (projects) {
          projects.forEach((item) => {
            results.push({
              id: `project-${item.id}`,
              title: item.name,
              description: item.description || "",
              type: "project",
              href: `/projects/${item.id}`,
              category: item.status,
            });
          });
        }
      } catch (e) {
        // Bảng projects chưa có
      }

      // Sắp xếp kết quả
      results.sort((a, b) => a.title.length - b.title.length);
      setResults(results.slice(0, 10));

      if (results.length > 0) {
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, performSearch]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      // Escape
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
      // Arrow keys
      if (isOpen && results.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + results.length) % results.length,
          );
        }
        if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          const result = results[selectedIndex];
          if (result) {
            saveRecentSearch(query);
            router.push(result.href);
            setIsOpen(false);
            setQuery("");
            setResults([]);
          }
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, router, saveRecentSearch]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    router.push(result.href);
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    performSearch(term);
    inputRef.current?.focus();
  };

  // Responsive widths
  // Responsive widths - THU NHỎ HƠN
  const inputWidth = useMemo(() => {
    if (isMobile) return "w-full";
    if (isTablet) return "w-32";
    return "w-40 lg:w-52";
  }, [isMobile, isTablet]);

  return (
    <div ref={ref} className="relative w-full md:w-auto">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          id="search-input"
          type="text"
          placeholder={isMobile ? "Tìm kiếm..." : "Tìm kiếm... (⌘K)"}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => {
            if (query.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className={cn(
            "pl-9 pr-8 h-9 md:h-10 rounded-xl bg-muted/50 border-border",
            "focus:bg-background focus:border-primary/50",
            "transition-all duration-200 text-sm",
            inputWidth,
          )}
          aria-label="Tìm kiếm"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-friendly"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {!query && !isMobile && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground bg-muted rounded border border-border">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50 min-w-[280px] md:min-w-[400px]"
          >
            {isLoading ? (
              <SearchSkeleton />
            ) : results.length > 0 ? (
              <div className="py-2 max-h-[350px] md:max-h-[450px] overflow-y-auto">
                {/* Results count */}
                <div className="px-4 py-1.5 text-[10px] text-muted-foreground border-b border-border/50">
                  {results.length} kết quả tìm thấy
                </div>

                {results.map((result, index) => {
                  const Icon = getIcon(result.type);
                  const isSelected = index === selectedIndex;
                  return (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.15, delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => handleResultClick(result)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left touch-friendly",
                          isSelected && "bg-muted/50",
                        )}
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                          <span
                            className={cn(
                              "text-[10px] px-2 py-0.5 rounded-full font-medium",
                              getTypeColor(result.type),
                            )}
                          >
                            {getTypeLabel(result.type)}
                          </span>
                          {result.category && (
                            <span className="text-[8px] text-muted-foreground">
                              {result.category}
                            </span>
                          )}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            ) : query.trim().length > 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <SearchIcon className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm font-medium">Không tìm thấy kết quả</p>
                <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : recentSearches.length > 0 ? (
              <div className="py-2">
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Tìm kiếm gần đây
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Xóa
                  </button>
                </div>
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(term)}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors text-left touch-friendly"
                  >
                    <ClockIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{term}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                <div className="w-12 h-12 mx-auto rounded-full bg-muted/50 flex items-center justify-center mb-3">
                  <SearchIcon className="w-6 h-6 opacity-50" />
                </div>
                <p className="text-sm font-medium">Bắt đầu tìm kiếm</p>
                <p className="text-xs mt-1">
                  Nhập từ khóa để tìm kiếm tài liệu, bài giảng, dự án...
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                  <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono">
                    ⌘
                  </kbd>
                  <span>+</span>
                  <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono">
                    K
                  </kbd>
                  <span>để mở nhanh</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Clock icon for recent searches
const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
