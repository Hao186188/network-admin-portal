// src/components/dashboard/DropdownMenu.tsx
// Vai trò: Dropdown menu - NÂNG CẤP

"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  MessageSquare,
  Plus,
  Upload
} from "lucide-react";

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  gradient: string;
  onClick: () => void;
}

const dropdownItems: DropdownItem[] = [
  {
    icon: Bell,
    label: "Đăng thông báo",
    description: "Thông báo đến toàn bộ lớp học",
    color: "text-primary",
    gradient: "from-primary to-secondary",
    onClick: () => {},
  },
  {
    icon: MessageSquare,
    label: "Đăng bài viết",
    description: "Chia sẻ kiến thức trên diễn đàn",
    color: "text-secondary",
    gradient: "from-secondary to-accent",
    onClick: () => {},
  },
  {
    icon: Upload,
    label: "Upload file",
    description: "Tải lên tài liệu, bài giảng",
    color: "text-blue-500",
    gradient: "from-blue-500 to-cyan-500",
    onClick: () => {},
  },
];

interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: (index: number) => void;
}

export function DropdownMenu({
  isOpen,
  onToggle,
  onItemClick,
}: DropdownMenuProps) {
  return (
    <div className="relative">
      <Button
        size="sm"
        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        onClick={onToggle}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Đăng tin</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-50"
          >
            <div className="p-2">
              {dropdownItems.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => onItemClick(index)}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group relative overflow-hidden"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
