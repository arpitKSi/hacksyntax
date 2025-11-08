"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface EnrollButtonProps {
  courseId: string;
  isEnrolled: boolean;
  price: number;
}

export default function EnrollButton({ courseId, isEnrolled, price }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to enroll");
      }

      toast.success("Successfully enrolled in course!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to enroll. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isEnrolled) {
    return (
      <Button
        onClick={() => router.push(`/courses/${courseId}/sections`)}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Continue Learning
      </Button>
    );
  }

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full bg-[#FDAB04] hover:bg-[#FDAB04]/80"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Enrolling...
        </>
      ) : (
        `Enroll Now - $${price}`
      )}
    </Button>
  );
}
