// src/components/common/animated-counter.tsx
// Vai trò: Component đếm số với animation - FIX controls.start()

"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2,
  delay = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Chỉ đánh dấu mounted sau khi component mount
  useEffect(() => {
    setMounted(true);
    return () => {
      // Cleanup animations khi unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Chỉ chạy animation khi đã mount
    if (!mounted) return;

    // Reset timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = Date.now() + delay * 1000;

    timerRef.current = setTimeout(() => {
      const startAnimation = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const value = Math.floor(easeOut(progress) * target);

        setCount(value);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(startAnimation);
        } else {
          setCount(target);
          // Chỉ gọi controls.start() khi đã mount và animation kết thúc
          if (mounted) {
            controls
              .start({
                scale: 1.1,
                transition: { duration: 0.2 },
              })
              .then(() => {
                if (mounted) {
                  controls.start({
                    scale: 1,
                    transition: { duration: 0.2 },
                  });
                }
              });
          }
        }
      };

      startAnimation();
    }, delay * 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, duration, delay, controls, mounted]);

  // Khi chưa mount, hiển thị placeholder
  if (!mounted) {
    return (
      <span className="inline-block">
        {prefix}
        {0}
        {suffix}
      </span>
    );
  }

  return (
    <motion.span animate={controls} className="inline-block">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
