// src/components/dashboard/UserActions.tsx
// Vai trò: User actions menu

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { HelpCircle, LogOut, Settings, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const userActions = [
  { icon: User, label: "Hồ sơ", href: "/profile" },
  { icon: Settings, label: "Cài đặt", href: "/settings" },
  { icon: HelpCircle, label: "Trợ giúp", href: "/faq" },
  { icon: LogOut, label: "Đăng xuất", action: "logout" },
];

export function UserActions() {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Quản lý tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {userActions.map((action, index) =>
              action.action === "logout" ? (
                <Button
                  key={index}
                  variant="outline"
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Button>
              ) : (
                <Link href={action.href as string} key={index}>
                  <Button
                    variant="outline"
                    className="gap-2 hover:bg-primary/10 hover:text-primary"
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                </Link>
              ),
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
