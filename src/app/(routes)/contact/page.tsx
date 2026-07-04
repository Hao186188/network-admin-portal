// src/app/(routes)/contact/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Globe, Link, Mail, MapPin, Phone, Send, User } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Gửi tin nhắn thành công!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Liên Hệ
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1 space-y-4"
          >
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Nguyễn Ngọc Thanh</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Giảng viên chủ nhiệm
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-primary-500" />
                    <span>thanh.nn@cdngk.edu.vn</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Phone className="w-5 h-5 text-primary-500" />
                    <span>+84 123 456 789</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-5 h-5 text-primary-500" />
                    <span>Trường Cao đẳng Nghề Kiên Giang</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <h4 className="font-semibold mb-3">Kết nối với chúng tôi</h4>
                  <div className="flex gap-2">
                    {[
                      {
                        icon: Link,
                        color: "from-blue-600 to-blue-700",
                        label: "Facebook",
                      },
                      {
                        icon: Link,
                        color: "from-gray-700 to-gray-800",
                        label: "GitHub",
                      },
                      {
                        icon: Globe,
                        color: "from-green-500 to-green-600",
                        label: "Website",
                      },
                      {
                        icon: Link,
                        color: "from-blue-500 to-blue-600",
                        label: "LinkedIn",
                      },
                    ].map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        className="rounded-xl hover:scale-110 transition-transform"
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-medium mb-2 block"
                      >
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        placeholder="Nhập họ và tên"
                        className="bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-medium mb-2 block"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        placeholder="Nhập email"
                        type="email"
                        className="bg-white/50 dark:bg-gray-800/50"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium mb-2 block"
                    >
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="subject"
                      placeholder="Nhập tiêu đề"
                      className="bg-white/50 dark:bg-gray-800/50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="text-sm font-medium mb-2 block"
                    >
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      className="flex min-h-[150px] w-full rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      placeholder="Nhập nội dung tin nhắn..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full md:w-auto gap-2 group"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
