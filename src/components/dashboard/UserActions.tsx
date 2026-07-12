// src/components/dashboard/UserActions.tsx
// NÂNG CẤP: Tích hợp GlitchText

"use client";

import { GlitchText } from "@/components/animations/GlitchText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { HelpCircle, LogOut, Settings, Sparkles, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const USER_ACTIONS = [
  {
    icon: User,
    label: "Hồ sơ",
    href: "/profile",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Settings,
    label: "Cài đặt",
    href: "/settings",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: HelpCircle,
    label: "Trợ giúp",
    href: "/faq",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: LogOut,
    label: "Đăng xuất",
    action: "logout",
    color: "from-red-500 to-rose-500",
  },
];

export function UserActions() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleLogout = () => signOut({ callbackUrl: "/login" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quản lý tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {USER_ACTIONS.map((action, index) => {
              const Icon = action.icon;
              const isLogout = action.action === "logout";

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {isLogout ? (
                    <Button
                      variant="outline"
                      className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all relative overflow-hidden group"
                      onClick={handleLogout}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg bg-gradient-to-r",
                          action.color,
                          "flex items-center justify-center",
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <GlitchText glitchIntensity={3}>
                        {action.label}
                      </GlitchText>
                      {hoveredIndex === index && (
                        <motion.div
                          layoutId="action-glow"
                          className="absolute inset-0 bg-destructive/5"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </Button>
                  ) : (
                    <Link href={action.href as string}>
                      <Button
                        variant="outline"
                        className="gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all relative overflow-hidden group"
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg bg-gradient-to-r",
                            action.color,
                            "flex items-center justify-center",
                          )}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        {action.label}
                        {hoveredIndex === index && (
                          <motion.div
                            layoutId="action-glow"
                            className="absolute inset-0 bg-primary/5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        )}
                      </Button>
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
