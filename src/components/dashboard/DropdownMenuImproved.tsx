// src/components/dashboard/DropdownMenuImproved.tsx
// DROPDOWN MENU CẢI TIẾN - DÙNG BOTTOM SHEET TRÊN MOBILE

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    ChevronDown,
    MessageSquare,
    Plus,
    Upload,
    X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DropdownItem {
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}

const DROPDOWN_ITEMS: DropdownItem[] = [
  {
    icon: Bell,
    label: "Đăng thông báo",
    description: "Thông báo đến toàn bộ lớp học",
    color: "from-primary to-secondary",
    onClick: () => {},
  },
  {
    icon: MessageSquare,
    label: "Đăng bài viết",
    description: "Chia sẻ kiến thức trên diễn đàn",
    color: "from-secondary to-accent",
    onClick: () => {},
  },
  {
    icon: Upload,
    label: "Upload file",
    description: "Tải lên tài liệu, bài giảng",
    color: "from-blue-500 to-cyan-500",
    onClick: () => {},
  },
];

interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: (index: number) => void;
}

export function DropdownMenuImproved({
  isOpen,
  onToggle,
  onItemClick,
}: DropdownMenuProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Nếu là mobile, hiển thị bottom sheet
  if (isMobile) {
    return (
      <>
        {/* Trigger Button */}
        <Button
          size="default"
          className="gap-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all px-2.5 py-1.5 text-xs h-8"
          onClick={onToggle}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="font-medium text-xs">Đăng tin</span>
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-300 flex-shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </Button>

        {/* Bottom Sheet */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onToggle}
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl border-t border-border z-50 max-h-[70vh] overflow-y-auto"
              >
                {/* Handle */}
                <div className="flex justify-center pt-2 pb-1">
                  <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                  <span className="text-sm font-medium text-foreground">
                    Chọn hành động
                  </span>
                  <button
                    onClick={onToggle}
                    className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Items */}
                <div className="p-2">
                  {DROPDOWN_ITEMS.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      onClick={() => {
                        onItemClick(index);
                        onToggle();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group relative overflow-hidden"
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg flex-shrink-0",
                          item.color,
                        )}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground text-sm">
                          {item.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop version
  return (
    <div className="relative">
      <Button
        size="sm"
        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all px-4 py-2 text-sm h-9"
        onClick={onToggle}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">Đăng tin</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180",
          )}
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
              {DROPDOWN_ITEMS.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => {
                    onItemClick(index);
                    onToggle();
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all group relative overflow-hidden"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg flex-shrink-0",
                      item.color,
                    )}
                  >
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-foreground text-sm md:text-base truncate">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
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
