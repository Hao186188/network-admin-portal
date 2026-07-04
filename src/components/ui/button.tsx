// src/components/ui/button.tsx

"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-primary-200 bg-white hover:bg-primary-50 hover:border-primary-300 text-primary-700",
        secondary: "bg-secondary-500 text-white hover:bg-secondary-600 shadow-lg shadow-secondary-500/25",
        ghost: "hover:bg-primary-50 hover:text-primary-700 text-primary-600",
        link: "text-primary-600 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white hover:scale-105 shadow-xl shadow-primary-500/30",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-lg dark:bg-gray-800/30 dark:border-gray-700/30",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-14 rounded-2xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }