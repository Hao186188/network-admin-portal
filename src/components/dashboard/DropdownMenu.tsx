// src/components/dashboard/DropdownMenu.tsx
// FIXED: Mobile responsive - KHÔNG BỊ TRÀN CHỮ

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, MessageSquare, Plus, Upload } from "lucide-react";
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

export function DropdownMenu({
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

  return (
    <div className="relative">
      <Button
        size={isMobile ? "default" : "sm"}
        className={cn(
          "gap-1 md:gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all",
          isMobile ? "px-2 py-1.5 text-xs h-8" : "px-4 py-2 text-sm h-9",
        )}
        onClick={onToggle}
      >
        <Plus
          className={cn("w-3.5 h-3.5", isMobile ? "w-3.5 h-3.5" : "w-4 h-4")}
        />
        <span
          className={cn(
            "font-medium",
            isMobile ? "text-xs ml-0.5" : "hidden sm:inline text-sm",
          )}
        >
          Đăng tin
        </span>
        <ChevronDown
          className={cn(
            "transition-transform duration-300 flex-shrink-0",
            isOpen && "rotate-180",
            isMobile ? "w-3 h-3 ml-0.5" : "w-4 h-4",
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
            className={cn(
              "absolute right-0 mt-2 bg-background rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-50",
              isMobile
                ? "w-[calc(100vw-2rem)] min-w-[180px] max-w-[300px]"
                : "w-72",
            )}
          >
            <div className={cn("p-1.5", isMobile && "p-1")}>
              {DROPDOWN_ITEMS.map((item, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => onItemClick(index)}
                  className={cn(
                    "w-full flex items-center gap-2 md:gap-3 rounded-xl hover:bg-muted/50 transition-all group relative overflow-hidden",
                    isMobile ? "p-2" : "p-3",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl bg-gradient-to-r flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg flex-shrink-0",
                      isMobile ? "w-7 h-7" : "w-10 h-10",
                      item.color,
                    )}
                  >
                    <item.icon
                      className={cn(
                        "text-white",
                        isMobile ? "w-3.5 h-3.5" : "w-5 h-5",
                      )}
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={cn(
                        "font-medium text-foreground truncate",
                        isMobile
                          ? "text-xs leading-tight"
                          : "text-sm md:text-base",
                      )}
                    >
                      {item.label}
                    </p>
                    <p
                      className={cn(
                        "text-muted-foreground truncate",
                        isMobile ? "text-[9px] leading-tight" : "text-xs",
                      )}
                    >
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
