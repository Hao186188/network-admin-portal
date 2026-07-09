// src/lib/logger.ts
// Vai trò: Utility logging - Chỉ log trong development

const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";
const isProd = process.env.NODE_ENV === "production";

// ✅ Chỉ log trong development và test
export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log("[LOG]", ...args);
    }
  },
  info: (...args: any[]) => {
    if (isDev) {
      console.info("[INFO]", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDev || isTest) {
      console.warn("[WARN]", ...args);
    }
  },
  error: (...args: any[]) => {
    // Error luôn được log trong dev và test
    if (isDev || isTest) {
      console.error("[ERROR]", ...args);
    }
    // Trong production, chỉ log lỗi nghiêm trọng
    if (isProd && args[0]?.message?.includes("critical")) {
      console.error("[CRITICAL]", ...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug("[DEBUG]", ...args);
    }
  },
  group: (label: string, fn: () => void) => {
    if (isDev) {
      console.group(`[GROUP] ${label}`);
      fn();
      console.groupEnd();
    }
  },
  table: (data: any) => {
    if (isDev) {
      console.table(data);
    }
  },
};

export const isDevelopment = isDev;
export const isProduction = isProd;
