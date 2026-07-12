// src/lib/cache.ts
// CACHING SERVICE

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  expiresAt: number;
};

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttl || this.defaultTTL),
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Invalidate by pattern
  invalidate(pattern: string | RegExp): void {
    for (const key of this.cache.keys()) {
      if (
        typeof pattern === "string" ? key.includes(pattern) : pattern.test(key)
      ) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats(): { size: number; keys: string[] } {
    const keys = Array.from(this.cache.keys());
    return {
      size: this.cache.size,
      keys,
    };
  }
}

export const cache = new CacheService();
