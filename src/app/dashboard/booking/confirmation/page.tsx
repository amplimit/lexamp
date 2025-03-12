// src/app/dashboard/booking/confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react"; // 导入 Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  CheckCircle,
  ArrowLeft,
  User,
  MapPin,
  Download,
  MessageSquare,
} from "lucide-react";

interface BookingDetails {
  slotId: string;
  startTime: string;
  endTime: string;
  lawyerId: string;
  lawyerName: string;
}

const BookingConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    // Get booking details from URL parameters
    const slotId = searchParams.get("slotId");
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");
    const lawyerId = searchParams.get("lawyerId");
    const lawyerName = searchParams.get("lawyerName");

    if (slotId && startTime && endTime && lawyerId && lawyerName) {
      setBookingDetails({
        slotId,
        startTime,
        endTime,
        lawyerId,
        lawyerName,
      });
    } else {
      // If no booking details in URL, redirect to dashboard
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const startDate = new Date(bookingDetails.startTime);
  const endDate = new Date(bookingDetails.endTime);

  const formattedDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your consultation with {bookingDetails.lawyerName} has been scheduled
          </p>
        </div>

        <Card className="p-6 mb-8 shadow-lg border-green-100">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Date</h3>
                <p className="mt-1 text-base text-gray-800">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Time</h3>
                <p className="mt-1 text-base text-gray-800">
                  {formattedStartTime} - {formattedEndTime}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Lawyer</h3>
                <p className="mt-1 text-base text-gray-800">{bookingDetails.lawyerName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">Meeting Type</h3>
                <p className="mt-1 text-base text-gray-800">Video Conference</p>
                <p className="mt-1 text-sm text-gray-500">
                  You will receive a link to join the video conference 30 minutes before your scheduled time.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-blue-900 mb-2">What to prepare</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Any relevant documents related to your case</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>A list of questions or concerns you want to discuss</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>A quiet, private location for your video conference</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Test your camera and microphone before the meeting</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Add to Calendar
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 flex items-center justify-center"
              onClick={() => router.push(`/dashboard/lawyers/${bookingDetails.lawyerId}`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Message Lawyer
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}

// 动态渲染配置
export const dynamic = "force-dynamic";