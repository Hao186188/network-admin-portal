// src/app/(routes)/documents/components/FolderBreadcrumbs.tsx
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronRight, Folder, FolderOpen, Home } from "lucide-react";

export interface BreadcrumbItem {
  id: string | null;
  title: string;
  path: string[];
}

interface FolderBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (index: number) => void;
  className?: string;
}

export function FolderBreadcrumbs({
  items,
  onNavigate,
  className,
}: FolderBreadcrumbsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-1.5 px-4 py-2.5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/5 overflow-x-auto hide-scrollbar",
        className,
      )}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isRoot = item.id === null;

        return (
          <div
            key={item.id || "root"}
            className="flex items-center flex-shrink-0"
          >
            {index > 0 && (
              <ChevronRight className="w-3.5 h-3.5 text-white/20 mx-1 flex-shrink-0" />
            )}

            <button
              onClick={() => onNavigate(index)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm transition-all duration-200",
                isLast
                  ? "text-cyan-400 font-semibold bg-cyan-500/10 cursor-default"
                  : "text-white/60 hover:text-white hover:bg-white/5",
                isRoot && !isLast && "text-white/80",
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
    </motion.div>
  );
}
