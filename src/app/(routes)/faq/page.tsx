// src/app/(routes)/faq/page.tsx

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link" // Add this import
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  MessageCircle,
  BookOpen,
  Users,
  Settings,
  Database,
  Shield,
  HelpCircle
} from "lucide-react"

const faqs = [
  {
    id: 1,
    category: "Tài liệu",
    icon: BookOpen,
    question: "Làm thế nào để tải tài liệu?",
    answer: "Bạn có thể tải tài liệu bằng cách truy cập vào trang Tài liệu, chọn tài liệu cần tải và nhấn nút 'Tải xuống'. Tài liệu sẽ được tải về máy của bạn."
  },
  {
    id: 2,
    category: "Tài liệu",
    icon: BookOpen,
    question: "Tài liệu được cập nhật bao lâu một lần?",
    answer: "Tài liệu được cập nhật liên tục. Thông thường, tài liệu mới sẽ được đăng tải ngay sau khi giảng viên hoàn thành bài giảng."
  },
  {
    id: 3,
    category: "Tài khoản",
    icon: Users,
    question: "Làm thế nào để đăng ký tài khoản?",
    answer: "Bạn có thể đăng ký tài khoản bằng cách nhấn vào nút 'Đăng ký' trên thanh menu và điền đầy đủ thông tin."
  },
  {
    id: 4,
    category: "Tài khoản",
    icon: Users,
    question: "Tôi quên mật khẩu, phải làm sao?",
    answer: "Bạn có thể sử dụng tính năng 'Quên mật khẩu' trên trang đăng nhập. Hệ thống sẽ gửi email hướng dẫn đặt lại mật khẩu."
  },
  {
    id: 5,
    category: "Kỹ thuật",
    icon: Settings,
    question: "Tôi cần cấu hình gì để xem video bài giảng?",
    answer: "Bạn chỉ cần có trình duyệt web hiện đại (Chrome, Firefox, Safari) và kết nối internet ổn định. Không cần cài thêm phần mềm đặc biệt."
  },
  {
    id: 6,
    category: "Kỹ thuật",
    icon: Settings,
    question: "Tại sao tôi không thể tải xuống file?",
    answer: "Vui lòng kiểm tra kết nối internet và dung lượng lưu trữ trên thiết bị. Nếu vẫn gặp vấn đề, hãy liên hệ với quản trị viên."
  },
  {
    id: 7,
    category: "Học tập",
    icon: BookOpen,
    question: "Làm thế nào để nộp bài tập?",
    answer: "Bạn có thể nộp bài tập qua trang 'Nộp bài'. Chọn bài tập cần nộp, tải file lên và nhấn 'Gửi bài'."
  },
  {
    id: 8,
    category: "Học tập",
    icon: BookOpen,
    question: "Bài tập được chấm như thế nào?",
    answer: "Bài tập sẽ được giảng viên chấm và phản hồi trong vòng 3-5 ngày làm việc. Kết quả sẽ được hiển thị trong trang cá nhân của bạn."
  }
]

const categories = ["Tất cả", "Tài liệu", "Tài khoản", "Kỹ thuật", "Học tập"]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tất cả" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-xl">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Câu hỏi thường gặp
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Tìm câu trả lời cho những thắc mắc của bạn
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center"
        >
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer hover:scale-105 transition-transform px-4 py-2 text-sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <AnimatePresence>
            {filteredFaqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center flex-shrink-0">
                          <faq.icon className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {faq.category}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {openFaq === faq.id ? (
                          <ChevronUp className="w-5 h-5 text-primary-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {openFaq === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-gray-200/50 dark:border-gray-700/50">
                          <div className="pt-4 pl-14">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy câu hỏi</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục
            </p>
          </motion.div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 border-primary-200/30">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Không tìm thấy câu trả lời? Liên hệ với chúng tôi!
              </p>
              <Button asChild className="gap-2">
                <Link href="/contact">
                  <MessageCircle className="w-4 h-4" />
                  Liên hệ hỗ trợ
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}