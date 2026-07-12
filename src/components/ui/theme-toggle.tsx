// src/components/ui/theme-toggle.tsx
// SỬ DỤNG CUSTOM HOOK

"use client";

import { useThemeOptimized } from "@/hooks/useThemeOptimized";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle() {
  const { isDark, toggleTheme, isTransitioning, mounted } = useThemeOptimized();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 opacity-0"
        aria-label="Chuyển đổi theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={cn(
        "h-9 w-9 relative",
        "hover:bg-primary/10 hover:scale-110",
        "active:scale-90",
        "theme-toggle-btn",
        isDark && "dark",
        isTransitioning && "pointer-events-none opacity-50",
      )}
      aria-label={`Chuyển sang chế độ ${isDark ? "sáng" : "tối"}`}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-150 absolute",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
      />

      <Moon
        className={cn(
          "h-4 w-4 transition-all duration-150 absolute",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
      />

      <span className="sr-only">Chuyển đổi giao diện</span>
    </Button>
  );
}
