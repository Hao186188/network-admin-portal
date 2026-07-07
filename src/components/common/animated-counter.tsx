// src/components/common/animated-counter.tsx
// Vai trò: Component đếm số với animation - FIX controls.start() error

"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const startTime = Date.now() + delay * 1000;
    const timer = setTimeout(() => {
      const animate = () => {
        const now = Date.now();
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const value = Math.floor(easeOut(progress) * target);

        setCount(value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
          // Chỉ gọi controls.start() khi đã mount
          if (mounted) {
            controls.start({ scale: 1.1, transition: { duration: 0.2 } });
            controls.start({
              scale: 1,
              transition: { duration: 0.2, delay: 0.2 },
            });
          }
        }
      };

      animate();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [target, duration, delay, controls, mounted]);

  // Không render gì nếu chưa mount
  if (!mounted) {
    return (
      <span>
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
