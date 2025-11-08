import { db } from "@/lib/db";
import { Course } from "@prisma/client";
import { BookOpen, Users, Clock, Star, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface EnhancedCourseCardProps {
  course: Course & {
    instructor: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      imageUrl: string | null;
      designation: string | null;
      departmentId: string | null;
    };
    department: {
      name: string;
      code: string;
    } | null;
    level: {
      name: string;
    } | null;
  };
}

const EnhancedCourseCard = ({ course }: EnhancedCourseCardProps) => {
  const tags = course.tags ? JSON.parse(course.tags) : [];
  const displayTags = tags.slice(0, 3);

  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="group border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
    >
      {/* Course Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={course.imageUrl || "/image_placeholder.webp"}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Rating Badge */}
        {course.rating && course.rating > 0 && (
          <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 px-2 py-1 rounded-lg flex items-center gap-1 shadow-md">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold">{course.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">({course.totalRatings})</span>
          </div>
        )}
        {/* Level Badge */}
        {course.level && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-[#FDAB04] text-white">
              {course.level.name}
            </Badge>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Department & Category */}
        {course.department && (
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Award className="h-3 w-3" />
            <span className="font-medium">{course.department.code}</span>
            <span>•</span>
            <span>{course.academicYear || "2024-2025"}</span>
          </div>
        )}

        {/* Course Title */}
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-[#FDAB04] transition-colors min-h-[56px]">
          {course.title}
        </h3>

        {/* Instructor Info */}
        <div className="flex items-center gap-2 group/instructor">
          <Link
            href={`/educators/${course.instructor.id}`}
            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors flex-1"
          >
            <Image
              src={course.instructor.imageUrl || "/avatar_placeholder.jpg"}
              alt={`${course.instructor.firstName} ${course.instructor.lastName}`}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium group-hover/instructor:text-[#FDAB04] transition-colors">
                {course.instructor.firstName} {course.instructor.lastName}
              </p>
              {course.instructor.designation && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {course.instructor.designation}
                </p>
              )}
            </div>
          </Link>
        </div>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {displayTags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{course.enrollmentCount} enrolled</span>
          </div>
          {course.duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{course.duration}</span>
            </div>
          )}
          {course.creditHours && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              <span>{course.creditHours} credits</span>
            </div>
          )}
        </div>

        {/* Price/Free Badge */}
        <div className="flex items-center justify-between pt-2">
          {course.price && course.price > 0 ? (
            <p className="text-lg font-bold text-[#FDAB04]">${course.price}</p>
          ) : (
            <Badge className="bg-green-500 text-white">Free for Students</Badge>
          )}
          {course.completionRate && course.completionRate > 0 && (
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {course.completionRate.toFixed(0)}% completion
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EnhancedCourseCard;
