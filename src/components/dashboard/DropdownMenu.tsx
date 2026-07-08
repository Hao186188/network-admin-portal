// src/components/dashboard/DropdownMenu.tsx
// Vai trò: Dropdown menu cho các action

"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, MessageSquare, Plus, Upload } from "lucide-react";

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}

const dropdownItems: DropdownItem[] = [
  {
    icon: Bell,
    label: "Đăng thông báo",
    description: "Thông báo đến toàn bộ lớp học",
    color: "text-primary",
    onClick: () => {},
  },
  {
    icon: MessageSquare,
    label: "Đăng bài viết",
    description: "Chia sẻ kiến thức trên diễn đàn",
    color: "text-secondary",
    onClick: () => {},
  },
  {
    icon: Upload,
    label: "Upload file",
    description: "Tải lên tài liệu, bài giảng",
    color: "text-blue-500",
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
        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
        onClick={onToggle}
      >
        <Plus className="w-4 h-4" />
        Đăng tin
        <ChevronDown
          className={`w-4 h-4 transition-transform ${
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
            className="absolute right-0 mt-2 w-72 bg-background rounded-2xl shadow-2xl border border-border overflow-hidden z-50"
          >
            <div className="p-2">
              {dropdownItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onItemClick(index);
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
