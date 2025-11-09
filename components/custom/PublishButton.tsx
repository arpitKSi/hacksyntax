"use client";

import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface PublishButtonProps {
  disabled: boolean;
  courseId: string;
  sectionId?: string;
  isPublished: boolean;
  page: string;
}

const PublishButton = ({
  disabled,
  courseId,
  sectionId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/courses/${courseId}`;
    if (page === "Section") {
      url += `/sections/${sectionId}`;
    }

    try {
      setIsLoading(true);
      isPublished
        ? await apiClient.post(`${url}/unpublish`)
        : await apiClient.post(`${url}/publish`);

      toast.success(`${page} ${isPublished ? "unpublished" : "published"}`);
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(
        `Failed to ${isPublished ? "unpublish" : "publish"} ${page}`,
        err
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
};

export default PublishButton;
