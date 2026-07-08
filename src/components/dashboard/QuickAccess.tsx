// src/components/dashboard/QuickAccess.tsx
// Vai trò: Grid truy cập nhanh

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    Bell,
    BookOpen,
    Calendar,
    Download,
    FileText,
    MessageSquare,
    Server,
    Shield,
    Users,
    Video,
} from "lucide-react";
import Link from "next/link";

const quickAccessItems = [
  {
    icon: FileText,
    label: "Tài liệu",
    color: "from-blue-500 to-blue-600",
    href: "/documents",
  },
  {
    icon: Video,
    label: "Bài giảng",
    color: "from-purple-500 to-purple-600",
    href: "/lectures",
  },
  {
    icon: Calendar,
    label: "Lịch học",
    color: "from-green-500 to-green-600",
    href: "/schedule",
  },
  {
    icon: Bell,
    label: "Thông báo",
    color: "from-orange-500 to-orange-600",
    href: "/announcements",
  },
  {
    icon: Users,
    label: "Lớp học",
    color: "from-pink-500 to-pink-600",
    href: "/courses",
  },
  {
    icon: BookOpen,
    label: "Môn học",
    color: "from-cyan-500 to-cyan-600",
    href: "/courses",
  },
  {
    icon: Server,
    label: "Phần mềm",
    color: "from-indigo-500 to-indigo-600",
    href: "/software",
  },
  {
    icon: Shield,
    label: "Bảo mật",
    color: "from-red-500 to-red-600",
    href: "/security",
  },
  {
    icon: MessageSquare,
    label: "Diễn đàn",
    color: "from-teal-500 to-teal-600",
    href: "/forum",
  },
  {
    icon: Download,
    label: "Tải tài liệu",
    color: "from-amber-500 to-amber-600",
    href: "/documents",
  },
];

export function QuickAccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            Truy cập nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {quickAccessItems.map((item, index) => (
              <Link href={item.href} key={index}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all group w-full"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </motion.button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
