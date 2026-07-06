// src/components/features/stats.tsx
// Vai trò: Hiển thị thống kê với animation số chạy

"use client";

import { AnimatedCounter } from "@/components/common/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsProps {
  stats: {
    value: number;
    label: string;
    icon: LucideIcon;
    suffix?: string;
  }[];
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="text-center hover:shadow-2xl transition-shadow border-border">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix || "+"}
                  duration={2}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
