// src/app/(routes)/admin/components/StatsCard.tsx

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  change?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: StatsCardProps) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {change && (
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <span className="inline-block rotate-90">▶</span>
                {change}
              </p>
            )}
          </div>
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
