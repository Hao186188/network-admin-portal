// src/components/forum/OnboardingGuide.tsx
// Vai trò: Hướng dẫn sử dụng cho từng trang

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
    CheckCircle,
    ChevronRight,
    Compass,
    Eye,
    FileText,
    Filter,
    Heart,
    Lightbulb,
    Plus,
    Reply,
    Rocket,
    Search,
    Send,
    Tag,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";

interface Step {
  icon: any;
  title: string;
  description: string;
  color: string;
}

interface OnboardingGuideProps {
  page: "forum" | "detail" | "create";
  onComplete?: () => void;
}

const forumSteps: Step[] = [
  {
    icon: Compass,
    title: "Khám phá diễn đàn",
    description:
      "Tại đây bạn có thể tìm thấy các bài viết, thảo luận về chủ đề mạng và công nghệ",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Search,
    title: "Tìm kiếm thông minh",
    description:
      "Sử dụng thanh tìm kiếm để tìm bài viết theo từ khóa, danh mục hoặc tags",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Filter,
    title: "Lọc bài viết",
    description:
      "Lọc bài viết theo danh mục để nhanh chóng tìm thấy nội dung bạn cần",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Plus,
    title: "Tạo bài viết mới",
    description: "Chia sẻ kiến thức, đặt câu hỏi hoặc thảo luận với cộng đồng",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Heart,
    title: "Tương tác",
    description:
      "Thích, trả lời và lưu bài viết để theo dõi những nội dung hay",
    color: "from-red-500 to-red-600",
  },
];

const detailSteps: Step[] = [
  {
    icon: Eye,
    title: "Xem chi tiết",
    description: "Đọc toàn bộ nội dung bài viết và theo dõi số lượt xem",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Heart,
    title: "Thích bài viết",
    description: "Thể hiện sự quan tâm bằng cách thích bài viết bạn yêu thích",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Reply,
    title: "Trả lời",
    description: "Đóng góp ý kiến, trả lời câu hỏi hoặc thảo luận với tác giả",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Send,
    title: "Gửi phản hồi",
    description: "Gửi trả lời của bạn để tham gia vào cuộc thảo luận",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Users,
    title: "Cộng đồng",
    description:
      "Kết nối với các thành viên khác và xây dựng mạng lưới kiến thức",
    color: "from-orange-500 to-orange-600",
  },
];

const createSteps: Step[] = [
  {
    icon: FileText,
    title: "Tiêu đề ấn tượng",
    description:
      "Tạo tiêu đề thu hút, mô tả ngắn gọn nội dung bài viết của bạn",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Tag,
    title: "Danh mục và Tags",
    description: "Chọn danh mục phù hợp và thêm tags để bài viết dễ tìm thấy",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Lightbulb,
    title: "Nội dung chất lượng",
    description:
      "Chia sẻ kiến thức, kinh nghiệm hoặc đặt câu hỏi một cách rõ ràng",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Rocket,
    title: "Đăng bài",
    description: "Hoàn thành và đăng bài viết để chia sẻ với cộng đồng",
    color: "from-green-500 to-green-600",
  },
];

const pageConfig = {
  forum: {
    steps: forumSteps,
    title: "🌐 Chào mừng đến với Diễn đàn",
    subtitle: "Khám phá và kết nối với cộng đồng học tập",
  },
  detail: {
    steps: detailSteps,
    title: "📖 Hướng dẫn xem bài viết",
    subtitle: "Tương tác và tham gia thảo luận",
  },
  create: {
    steps: createSteps,
    title: "✍️ Tạo bài viết mới",
    subtitle: "Chia sẻ kiến thức với cộng đồng",
  },
};

export function OnboardingGuide({ page, onComplete }: OnboardingGuideProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkipping, setIsSkipping] = useState(false);

  const config = pageConfig[page];
  const steps = config?.steps || [];
  const totalSteps = steps.length;

  useEffect(() => {
    const hasSeen = localStorage.getItem(`onboarding_${page}`);
    if (hasSeen) {
      setIsOpen(false);
    }
  }, [page]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding_${page}`, "true");
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const handleSkip = () => {
    setIsSkipping(true);
    setTimeout(() => {
      handleComplete();
    }, 300);
  };

  if (!isOpen || isSkipping || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-4 md:inset-auto md:bottom-8 md:right-8 md:max-w-sm z-50 pointer-events-none"
      >
        <Card className="pointer-events-auto shadow-2xl border-primary/20 overflow-hidden bg-background/95 backdrop-blur-xl">
          {/* Progress bar */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{config?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {config?.subtitle}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted flex-shrink-0"
                onClick={handleSkip}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Step content */}
            <div key={currentStep} className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${currentStepData?.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                >
                  {currentStepData?.icon && (
                    <currentStepData.icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{currentStepData?.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentStepData?.description}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? "w-6 bg-primary"
                          : index < currentStep
                            ? "w-1.5 bg-primary/60"
                            : "w-1.5 bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {currentStep + 1}/{totalSteps}
                  </span>
                  <Button size="sm" className="gap-1" onClick={handleNext}>
                    {currentStep === totalSteps - 1 ? (
                      <>
                        Bắt đầu
                        <CheckCircle className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Tiếp theo
                        <ChevronRight className="w-3 h-3" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
