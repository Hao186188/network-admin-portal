// src/app/error.tsx

"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, AlertCircle, Server } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            500
          </div>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4"
          >
            <Server className="w-12 h-12 text-red-500" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Lỗi máy chủ
            </h2>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-md mx-auto">
            Đã xảy ra lỗi khi xử lý yêu cầu của bạn.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
            {error.message || "Lỗi không xác định"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={reset}
              className="gap-2 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </Button>
            <Link href="/">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
            </Link>
          </div>

          {error.digest && (
            <div className="mt-8 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Mã lỗi: {error.digest}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}