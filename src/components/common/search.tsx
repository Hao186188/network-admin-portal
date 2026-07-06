// src/components/common/search.tsx
// Vai trò: Search bar với kết quả

"use client";

import { Input } from "@/components/ui/input";
import {
    Bell,
    BookOpen,
    FileText,
    Folder,
    Search as SearchIcon,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "document" | "lecture" | "project" | "announcement";
  href: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Giáo trình Quản trị Mạng",
    description: "Tài liệu học tập",
    type: "document",
    href: "/documents/1",
  },
  {
    id: "2",
    title: "Bài giảng VLAN",
    description: "Video bài giảng",
    type: "lecture",
    href: "/lectures/2",
  },
  {
    id: "3",
    title: "Dự án mạng doanh nghiệp",
    description: "Dự án thực tế",
    type: "project",
    href: "/projects/3",
  },
];

const getIcon = (type: SearchResult["type"]) => {
  switch (type) {
    case "document":
      return FileText;
    case "lecture":
      return BookOpen;
    case "project":
      return Folder;
    case "announcement":
      return Bell;
    default:
      return FileText;
  }
};

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        document.getElementById("search-input")?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length > 0) {
      setIsLoading(true);
      // Giả lập tìm kiếm
      setTimeout(() => {
        const filtered = mockResults.filter(
          (r) =>
            r.title.toLowerCase().includes(value.toLowerCase()) ||
            r.description.toLowerCase().includes(value.toLowerCase()),
        );
        setResults(filtered);
        setIsLoading(false);
        setIsOpen(true);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          id="search-input"
          type="text"
          placeholder="Tìm kiếm... (⌘K)"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(e.target.value)
          }
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="pl-9 pr-8 w-full md:w-64 h-9 rounded-xl bg-muted/50 border-border focus:bg-background transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Đang tìm kiếm...
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => {
                const Icon = getIcon(result.type);
                return (
                  <Link
                    key={result.id}
                    href={result.href}
                    onClick={() => {
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors"
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
                    <span className="text-xs text-muted-foreground capitalize">
                      {result.type}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Không tìm thấy kết quả
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
