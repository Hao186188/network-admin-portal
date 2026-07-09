// src/components/dashboard/StatsCard.tsx
// Vai trò: Card hiển thị thống kê - NÂNG CẤP

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  change?: string;
  href: string;
  delay?: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  href,
  delay = 0,
}: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-5, 5]);

  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="touch-friendly"
    >
      <Link href={href}>
        <motion.div
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 border-border/50 hover:border-primary/30 active:scale-[0.98]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">
                    {title}
                  </p>
                  <p className="text-xl md:text-3xl font-bold mt-1 md:mt-2 text-foreground">
                    {displayValue}
                  </p>
                  {change && change !== "0%" && (
                    <p className="text-[10px] md:text-xs text-green-500 mt-0.5 md:mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-2 h-2 md:w-3 md:h-3" />
                      {change}
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                >
                  <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/60 transition-all duration-300" />
            </CardContent>
            {isHovered && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
            )}
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
