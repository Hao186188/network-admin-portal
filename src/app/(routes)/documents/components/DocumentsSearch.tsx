// src/app/(routes)/documents/components/DocumentsSearch.tsx
// SEARCH BAR

"use client";

import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";

interface DocumentsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DocumentsSearch({
  value,
  onChange,
  placeholder = "Tìm kiếm tài liệu...",
}: DocumentsSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex-1"
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-12 bg-black/40 backdrop-blur-sm border-white/10 text-white placeholder:text-white/30 focus:border-cyan-500/50 transition-all"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}
