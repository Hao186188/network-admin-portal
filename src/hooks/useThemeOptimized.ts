// src/hooks/useThemeOptimized.ts
// CUSTOM HOOK - TỐI ƯU THEME

"use client";

import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function useThemeOptimized() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    if (isTransitioning || !mounted) return;

    setIsTransitioning(true);

    // Thêm class no-transition
    document.documentElement.classList.add("no-transition");

    // Đổi theme
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

    // Xóa class sau khi đổi
    requestAnimationFrame(() => {
      document.documentElement.classList.remove("no-transition");
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    });
  }, [resolvedTheme, setTheme, isTransitioning, mounted]);

  return {
    theme,
    setTheme,
    resolvedTheme,
    isTransitioning,
    toggleTheme,
    mounted,
    isDark: resolvedTheme === "dark",
  };
}
