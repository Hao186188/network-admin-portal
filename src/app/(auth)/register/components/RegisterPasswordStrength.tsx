// src/app/(auth)/register/components/RegisterPasswordStrength.tsx
// Vai trò: Thanh đo độ mạnh mật khẩu

"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RegisterPasswordStrengthProps {
  password: string;
}

export function RegisterPasswordStrength({
  password,
}: RegisterPasswordStrengthProps) {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState("Nhập mật khẩu");
  const [color, setColor] = useState("bg-muted");

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel("Nhập mật khẩu");
      setColor("bg-muted");
      return;
    }

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const percentage = (score / 5) * 100;
    setStrength(percentage);

    if (score <= 1) {
      setLabel("Yếu");
      setColor("bg-red-500");
    } else if (score <= 2) {
      setLabel("Trung bình");
      setColor("bg-yellow-500");
    } else if (score <= 3) {
      setLabel("Khá");
      setColor("bg-orange-500");
    } else if (score <= 4) {
      setLabel("Mạnh");
      setColor("bg-blue-500");
    } else {
      setLabel("Rất mạnh");
      setColor("bg-green-500");
    }
  }, [password]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Độ mạnh mật khẩu</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-colors ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{
            duration: 0.6,
            ease: [0.25, 1, 0.5, 1],
          }}
        />
      </div>
    </div>
  );
}
