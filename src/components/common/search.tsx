// src/components/common/search.tsx
// Vai trò: Search component - TỐI ƯU RESPONSIVE

"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "post" | "document" | "assignment" | "course";
}

export function Search() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery] = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Search
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // Giả lập tìm kiếm - Thay thế bằng API thực
        const mockResults: SearchResult[] = [
          {
            id: "1",
            title: `Kết quả cho "${debouncedQuery}"`,
            description: "Bài viết về mạng máy tính",
            url: "/forum",
            type: "post",
          },
        ];
        setResults(mockResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.url);
      setIsOpen(false);
      setQuery("");
    },
    [router],
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* ✅ Desktop - Hiển thị đầy đủ */}
        <div className="hidden sm:flex items-center relative">
          <Button
            variant="outline"
            className="relative h-9 w-full justify-start rounded-full text-muted-foreground bg-muted/30 border-border/50 hover:bg-muted/50 min-w-[120px] md:min-w-[160px] lg:min-w-[200px] xl:min-w-[240px]"
            onClick={() => setIsOpen(true)}
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            <span className="text-xs">Tìm kiếm...</span>
            <kbd className="pointer-events-none absolute right-3 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              ⌘K
            </kbd>
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] p-0 gap-0 top-[20%] sm:top-[30%] translate-y-0">
        <div className="flex items-center border-b border-border p-3">
          <SearchIcon className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết, tài liệu..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-sm"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={clearSearch}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg transition-colors",
                    selectedIndex === index
                      ? "bg-primary/10"
                      : "hover:bg-muted",
                  )}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{result.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {result.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {result.description}
                  </p>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Không tìm thấy kết quả
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Nhập từ khóa để tìm kiếm
            </div>
          )}
        </div>

        <div className="border-t border-border p-2 flex justify-between text-[10px] text-muted-foreground">
          <span>Nhấn Enter để tìm kiếm</span>
          <span>Esc để đóng</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
