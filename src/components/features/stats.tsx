// src/components/features/stats.tsx
// Vai trò: Hiển thị thống kê

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsProps {
  stats: {
    value: string;
    label: string;
    icon: LucideIcon;
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
          <Card className="text-center hover:shadow-2xl transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
