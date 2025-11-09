"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import apiClient, { authHelpers, extractApiData } from "@/lib/api-client";

interface CourseSideBarProps {
  courseId: string;
}

interface Section {
  id: string;
  title: string;
  position: number;
  isPublished: boolean;
}

interface CourseData {
  id: string;
  title: string;
  sections: Section[];
  progressPercentage: number;
  isPurchased: boolean;
}

const CourseSideBar = ({ courseId }: CourseSideBarProps) => {
  const pathname = usePathname();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const user = authHelpers.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get(`/courses/${courseId}`);
        const payload = extractApiData(response.data) as CourseData;
        setCourse(payload);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const publishedSections = useMemo(() => {
    if (!course?.sections) return [] as Section[];
    return [...course.sections]
      .filter((section) => section.isPublished)
      .sort((a, b) => a.position - b.position);
  }, [course]);

  if (loading) {
    return (
      <>
        <div className="md:hidden px-4 py-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-6 w-56 bg-gray-200 rounded" />
          </div>
        </div>
        <aside className="hidden md:flex md:w-64 lg:w-72 flex-shrink-0 flex-col gap-3 border-r px-4 py-6 shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </aside>
      </>
    );
  }

  if (!course) {
    return null;
  }

  const renderNavLinks = (onNavigate?: () => void) => (
    <div className="flex flex-col gap-1">
      <Link
        href={`/courses/${course.id}/overview`}
        onClick={onNavigate}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[#FFF8EB] ${
          pathname.endsWith("/overview") ? "bg-[#FDAB04]/20 text-[#FDAB04]" : "text-foreground/80"
        }`}
      >
        Overview
      </Link>
      {publishedSections.map((section) => {
        const isActive = pathname.includes(section.id);
        return (
          <Link
            key={section.id}
            href={`/courses/${course.id}/sections/${section.id}`}
            onClick={onNavigate}
            className={`rounded-lg px-3 py-2 text-sm transition-colors hover:bg-[#FFF8EB] ${
              isActive ? "bg-[#FDAB04]/20 text-[#FDAB04]" : "text-foreground/70"
            }`}
          >
            {section.title}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      <div className="md:hidden border-b bg-background px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Course</p>
            <h2 className="text-base font-semibold text-foreground line-clamp-2">{course.title}</h2>
          </div>
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Menu className="h-4 w-4" />
                Sections
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle className="text-left">{course.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {course.isPurchased && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</p>
                    <Progress value={course.progressPercentage} className="mt-2 h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {Math.round(course.progressPercentage)}% completed
                    </p>
                  </div>
                )}
                {renderNavLinks(() => setSheetOpen(false))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {course.isPurchased && (
          <div className="mt-3">
            <Progress value={course.progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(course.progressPercentage)}% completed
            </p>
          </div>
        )}
      </div>

      <aside className="hidden md:flex md:w-64 lg:w-72 flex-shrink-0 flex-col gap-4 border-r bg-background px-4 py-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground">{course.title}</h1>
        {course.isPurchased && (
          <div>
            <Progress value={course.progressPercentage} className="h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              {Math.round(course.progressPercentage)}% completed
            </p>
          </div>
        )}
        {renderNavLinks()}
      </aside>
    </>
  );
};

export default CourseSideBar;
