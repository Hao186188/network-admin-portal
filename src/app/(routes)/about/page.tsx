// src/app/(routes)/about/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  CheckCircle,
  Globe,
  Link,
  MessageCircle,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

// Sử dụng Link icon thay cho Facebook và Github
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-4 h-4 flex items-center justify-center">{children}</span>
);

const features = [
  {
    icon: BookOpen,
    title: "Tài liệu phong phú",
    description:
      "Hàng trăm tài liệu, bài giảng và giáo trình được cập nhật liên tục",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Users,
    title: "Cộng đồng học tập",
    description:
      "Kết nối với giảng viên và sinh viên để cùng học hỏi và phát triển",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Cập nhật công nghệ",
    description: "Luôn cập nhật những công nghệ mới nhất trong lĩnh vực mạng",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Shield,
    title: "Bảo mật cao",
    description: "Hệ thống được bảo vệ với các tiêu chuẩn bảo mật hàng đầu",
    color: "from-red-500 to-red-600",
  },
];

const stats = [
  { value: "50+", label: "Tài liệu", icon: BookOpen },
  { value: "30+", label: "Bài giảng", icon: Zap },
  { value: "25+", label: "Sinh viên", icon: Users },
  { value: "10+", label: "Dự án", icon: Target },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent mb-6">
              Giới thiệu lớp
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Lớp Quản trị Mạng 3 - Nơi đào tạo những chuyên gia mạng tương lai
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-2xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">
            Tại sao chọn{" "}
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Mạng 3 Hub
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Teacher Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 p-1">
                      <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Users className="w-20 h-20 text-primary-500" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 p-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mt-4">Nguyễn Ngọc Thanh</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Giảng viên chủ nhiệm
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="success">10+ năm kinh nghiệm</Badge>
                    <Badge variant="purple">CCNP</Badge>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary-500" />
                      Chuyên môn
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Quản trị mạng, Bảo mật mạng, Thiết kế hạ tầng mạng, Cisco
                      Networking
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary-500" />
                      Các môn phụ trách
                    </h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        "Quản trị Mạng 3",
                        "Bảo mật Mạng",
                        "Cisco CCNA",
                        "Linux Server",
                      ].map((subject) => (
                        <Badge key={subject} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary-500" />
                      Lời nhắn
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      "Học tập là chìa khóa để mở cánh cửa tương lai. Hãy luôn
                      tò mò và không ngừng học hỏi."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Developer Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-accent-500 to-primary-500 p-1">
                    <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent-500">
                        VNH
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-bold">Võ Nhật Hào</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Stack Developer • UI/UX Designer • Network Engineer
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Người phát triển website với đam mê công nghệ và thiết kế
                    đẹp.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                    <Link href="https://github.com" target="_blank">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Link className="w-4 h-4" />
                        GitHub
                      </Button>
                    </Link>
                    <Link href="#" target="_blank">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </Button>
                    </Link>
                    <Link href="#" target="_blank">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Link className="w-4 h-4" />
                        Facebook
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-accent-500/10 border-primary-200/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Sẵn sàng tham gia?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Cùng xây dựng một cộng đồng học tập mạnh mẽ và đầy tri thức
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/documents">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <BookOpen className="w-4 h-4" />
                    Khám phá tài liệu
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Liên hệ ngay
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
