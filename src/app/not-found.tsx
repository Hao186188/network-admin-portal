// src/app/not-found.tsx

"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            404
          </h1>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-4 -right-4"
          >
            <AlertTriangle className="w-12 h-12 text-yellow-500" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không có sẵn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Về trang chủ
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2 w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>

          {/* Search Suggestions */}
          <div className="mt-12 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Hoặc bạn có thể tìm kiếm:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Tài liệu", "Bài giảng", "Lịch học", "Diễn đàn", "Liên hệ"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(" ", "-")}`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Search className="w-3 h-3" />
                    {item}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}