// src/hooks/use-sidebar.ts
// Vai trò: Quản lý state sidebar

"use client";

import { useCallback, useEffect, useState } from "react";

interface SidebarState {
  isCollapsed: boolean;
  isMobile: boolean;
  isMobileOpen: boolean;
  width: number;
}

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 280;
const MOBILE_BREAKPOINT = 1024;

export function useSidebar() {
  const [state, setState] = useState<SidebarState>({
    isCollapsed: false,
    isMobile: false,
    isMobileOpen: false,
    width: EXPANDED_WIDTH,
  });

  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setState((prev) => ({
      ...prev,
      isMobile: mobile,
      isCollapsed: mobile ? true : prev.isCollapsed,
      isMobileOpen: mobile ? false : prev.isMobileOpen,
      width: mobile
        ? COLLAPSED_WIDTH
        : prev.isCollapsed
          ? COLLAPSED_WIDTH
          : EXPANDED_WIDTH,
    }));
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  const toggle = useCallback(() => {
    if (state.isMobile) {
      setState((prev) => ({
        ...prev,
        isMobileOpen: !prev.isMobileOpen,
        width: !prev.isMobileOpen ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        isCollapsed: !prev.isCollapsed,
        width: !prev.isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
      }));
    }
  }, [state.isMobile]);

  const closeMobile = useCallback(() => {
    if (state.isMobile) {
      setState((prev) => ({
        ...prev,
        isMobileOpen: false,
        width: COLLAPSED_WIDTH,
      }));
    }
  }, [state.isMobile]);

  return {
    ...state,
    toggle,
    closeMobile,
    isVisible: !state.isMobile || state.isMobileOpen,
  };
}
