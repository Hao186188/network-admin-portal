// src/app/(routes)/documents/components/DocumentsPagination.tsx
// PAGINATION COMPONENT

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DocumentsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function DocumentsPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: DocumentsPaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2 mt-8", className)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-white/10 hover:border-primary/50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPageNumbers().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={cn(
            "min-w-[40px]",
            page === currentPage
              ? "bg-gradient-to-r from-cyan-500 to-blue-500"
              : "border-white/10 hover:border-primary/50",
            page === "..." && "cursor-default opacity-50",
          )}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-white/10 hover:border-primary/50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
