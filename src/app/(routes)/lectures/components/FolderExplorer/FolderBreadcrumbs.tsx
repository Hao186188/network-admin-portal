// src/app/(routes)/lectures/components/FolderExplorer/FolderBreadcrumbs.tsx
// BREADCRUMBS CHO LECTURES FOLDER - HOÀN CHỈNH

"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";
import { BreadcrumbItem, FolderBreadcrumbsProps } from "./types";

export function FolderBreadcrumbs({
  items,
  onNavigate,
}: FolderBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/5 bg-black/20 overflow-x-auto hide-scrollbar rounded-t-xl">
      {items.map((item: BreadcrumbItem, index: number) => {
        const isLast = index === items.length - 1;
        const isRoot = item.id === null;

        return (
          <div
            key={item.id || "root"}
            className="flex items-center flex-shrink-0"
          >
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-white/20 mx-1" />
            )}

            <button
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-all duration-200 whitespace-nowrap",
                isLast
                  ? "text-cyan-400 font-medium bg-cyan-500/10 cursor-default"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              )}
              disabled={isLast}
            >
              {isRoot ? (
                <Home className="w-3.5 h-3.5" />
              ) : isLast ? (
                <FolderOpen className="w-3.5 h-3.5" />
              ) : (
                <Folder className="w-3.5 h-3.5" />
              )}
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {item.title}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
