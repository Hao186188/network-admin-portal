// src/app/(routes)/terms/page.tsx
// Vai trò: Hiển thị điều khoản sử dụng của website

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
            Điều khoản sử dụng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Vui lòng đọc kỹ trước khi sử dụng dịch vụ
          </p>
        </motion.div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                1. Chấp nhận điều khoản
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Bằng việc sử dụng Mạng 3 Hub, bạn đồng ý tuân theo các điều
                khoản và điều kiện được quy định tại đây.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                2. Tài khoản người dùng
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Bạn có trách nhiệm bảo mật thông tin tài khoản của mình. Mọi
                hoạt động từ tài khoản của bạn đều do bạn chịu trách nhiệm.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                3. Nội dung và hành vi
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Người dùng không được đăng tải nội dung vi phạm pháp luật, xúc
                phạm, hoặc gây hại cho người khác.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Bản quyền</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Tất cả nội dung trên Mạng 3 Hub được bảo vệ bởi luật bản quyền.
                Không được sao chép hoặc phân phối mà không có sự cho phép.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                5. Thay đổi điều khoản
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Chúng tôi có quyền thay đổi các điều khoản này bất kỳ lúc nào.
                Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc bạn chấp nhận
                các thay đổi.
              </p>
            </section>

            <div className="flex gap-4 justify-center pt-4">
              <Link href="/register">
                <Button>Đồng ý và tiếp tục</Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Từ chối</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
