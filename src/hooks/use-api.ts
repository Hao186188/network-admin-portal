// src/hooks/use-api.ts
// Vai trò: Hook API với AbortController

"use client";

import { logger } from "@/lib/logger";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseApiOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T = any>(
  fetcher: (signal?: AbortSignal) => Promise<T>,
  options: UseApiOptions = {},
) {
  const { autoFetch = false, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ✅ AbortController để hủy request
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async () => {
    // Hủy request cũ nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Tạo controller mới
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetcher(controller.signal);
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err: any) {
      // Không xử lý lỗi do abort
      if (err.name === "AbortError") {
        logger.log("Request cancelled");
        return;
      }

      setError(err);
      onError?.(err);
      logger.error("API Error:", err);
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [fetcher, onSuccess, onError]);

  // ✅ Auto fetch
  useEffect(() => {
    if (autoFetch) {
      execute();
    }

    // Cleanup: hủy request khi unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [autoFetch, execute]);

  return {
    data,
    loading,
    error,
    execute,
    abort: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    },
  };
}
