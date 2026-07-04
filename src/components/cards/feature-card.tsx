// src/components/cards/feature-card.tsx
// Vai trò: Card hiển thị tính năng

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <CardContent className="p-6 text-center">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
