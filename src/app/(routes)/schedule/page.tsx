// src/app/(routes)/schedule/page.tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
    BookOpen,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    MapPin,
    Users
} from "lucide-react";
import { useState } from "react";

const scheduleData = [
  {
    id: 1,
    day: "Thứ 2",
    date: "22/06/2026",
    time: "07:30 - 10:30",
    subject: "Quản trị Mạng 3",
    room: "Phòng A1.2",
    teacher: "Nguyễn Ngọc Thanh",
    type: "Lý thuyết",
  },
  {
    id: 2,
    day: "Thứ 3",
    date: "23/06/2026",
    time: "13:00 - 16:00",
    subject: "Bảo mật Mạng",
    room: "Phòng B2.1",
    teacher: "Nguyễn Ngọc Thanh",
    type: "Thực hành",
  },
  {
    id: 3,
    day: "Thứ 4",
    date: "24/06/2026",
    time: "07:30 - 10:30",
    subject: "Cisco CCNA",
    room: "Phòng Lab 3",
    teacher: "Nguyễn Ngọc Thanh",
    type: "Lab",
  },
  {
    id: 4,
    day: "Thứ 5",
    date: "25/06/2026",
    time: "13:00 - 16:00",
    subject: "Linux Server",
    room: "Phòng B2.2",
    teacher: "Nguyễn Ngọc Thanh",
    type: "Thực hành",
  },
  {
    id: 5,
    day: "Thứ 6",
    date: "26/06/2026",
    time: "07:30 - 10:30",
    subject: "Đồ án môn học",
    room: "Phòng A1.1",
    teacher: "Nguyễn Ngọc Thanh",
    type: "Thảo luận",
  },
];

const examSchedule = [
  {
    id: 1,
    subject: "Quản trị Mạng 3",
    date: "30/06/2026",
    time: "08:00 - 10:00",
    room: "Phòng A1.2",
    type: "Giữa kỳ",
  },
  {
    id: 2,
    subject: "Bảo mật Mạng",
    date: "05/07/2026",
    time: "08:00 - 10:00",
    room: "Phòng B2.1",
    type: "Giữa kỳ",
  },
];

export default function SchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [view, setView] = useState<"schedule" | "exam">("schedule");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Lịch Học
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Lịch học và lịch thi của lớp
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "schedule" ? "default" : "outline"}
              onClick={() => setView("schedule")}
            >
              Lịch học
            </Button>
            <Button
              variant={view === "exam" ? "default" : "outline"}
              onClick={() => setView("exam")}
            >
              Lịch thi
            </Button>
          </div>
        </motion.div>

        {view === "schedule" ? (
          <>
            {/* Week Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek((prev) => prev - 1)}
                disabled={currentWeek === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-semibold">
                Tuần {currentWeek + 1} - Tháng 6/2026
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentWeek((prev) => prev + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Schedule Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {scheduleData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge
                            variant="outline"
                            className="text-sm font-semibold"
                          >
                            {item.day}
                          </Badge>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.date}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {item.type}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {item.subject}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary-500" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-500" />
                          <span>{item.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary-500" />
                          <span>{item.teacher}</span>
                        </div>
                      </div>

                      <Button className="w-full mt-4 gap-2">
                        <BookOpen className="w-4 h-4" />
                        Chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          /* Exam Schedule */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {examSchedule.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-red-200/50 dark:border-red-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge
                        variant="destructive"
                        className="text-sm font-semibold"
                      >
                        {exam.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        {exam.date}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                      {exam.subject}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        <span>{exam.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{exam.room}</span>
                      </div>
                    </div>

                    <Button variant="destructive" className="w-full mt-4 gap-2">
                      <Calendar className="w-4 h-4" />
                      Thêm vào lịch
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
