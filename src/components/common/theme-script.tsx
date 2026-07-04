// src/components/common/theme-script.tsx

"use client";

import { useEffect } from "react";

export function ThemeScript() {
  useEffect(() => {
    // Chạy script này trên client để set theme
    const setTheme = () => {
      try {
        const theme = localStorage.getItem("theme");
        const systemDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (theme === "dark" || (!theme && systemDark)) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (_) {}
    };

    setTheme();

    // Lắng nghe thay đổi system theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setTheme();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return null;
}
