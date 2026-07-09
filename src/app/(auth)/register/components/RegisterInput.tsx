// src/app/(auth)/register/components/RegisterInput.tsx
// Vai trò: Input với floating label và laser line - FIXED

"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// ✅ SỬA: icon type thành React.ElementType
interface RegisterInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function RegisterInput({
  label,
  type = "text",
  value,
  onChange,
  icon: Icon,
  required = false,
  disabled = false,
  showPasswordToggle = false,
  error,
  placeholder,
  className,
}: RegisterInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const isActive = isFocused || value.length > 0;

  return (
    <div className={cn("relative my-6", className)}>
      {/* Icon */}
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
      )}

      {/* Floating Label */}
      <motion.label
        className={cn(
          "absolute pointer-events-none z-10 transition-colors",
          Icon ? "left-10" : "left-3",
        )}
        animate={{
          top: isActive ? -10 : 12,
          left: isActive ? (Icon ? 12 : 12) : Icon ? 40 : 12,
          scale: isActive ? 0.8 : 1,
          color: isFocused
            ? "hsl(var(--primary))"
            : "hsl(var(--muted-foreground))",
          background: isActive ? "hsl(var(--background))" : "transparent",
          padding: isActive ? "0 4px" : "0",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </motion.label>

      {/* Input */}
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={isFocused ? placeholder || label : ""}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-3 bg-background/50 border rounded-xl text-foreground outline-none backdrop-blur-sm transition-all duration-300",
          Icon ? "pl-10" : "pl-3",
          showPasswordToggle ? "pr-10" : "pr-3",
          isFocused
            ? "border-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.05)]"
            : "border-border hover:border-primary/30",
          error ? "border-red-500 focus:border-red-500" : "",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      />

      {/* ✅ SỬA: Password Toggle - KHÔNG DÙNG if bên trong JSX */}
      {showPasswordToggle && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Laser Line Effect */}
      {isFocused && !error && (
        <motion.div
          layoutId={`laser-${label}`}
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          initial={{ width: 0, left: "50%" }}
          animate={{ width: "100%", left: "0%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      )}

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
        >
          <span className="text-red-500">⚠️</span>
          {error}
        </motion.p>
      )}
    </div>
  );
}
