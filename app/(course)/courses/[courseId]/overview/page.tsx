import { clerkClient, auth } from "@/shims/clerk-server";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";
import EnrollButton from "@/components/courses/EnrollButton";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  // Check if user is enrolled
  let isEnrolled = false;
  if (userId) {
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });
    
    if (user) {
      const enrollment = await db.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: user.id,
            courseId: params.courseId,
          },
        },
      });
      isEnrolled = !!enrollment;
    }
  }

  const instructor = await clerkClient.users.getUser(course.instructorId);

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return (
    <div className="px-6 py-4 flex flex-col gap-5 text-sm">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
          <p className="font-medium">{course.subtitle}</p>
        </div>
        <div className="flex gap-3 items-center">
          <EnrollButton courseId={course.id} isEnrolled={isEnrolled} price={course.price!} />
          <SectionMenu course={course} />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Image
          src={
            instructor.imageUrl
              ? instructor.imageUrl
              : "/avatar_placeholder.jpg"
          }
          alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
          width={30}
          height={30}
          className="rounded-full"
        />
        <p className="font-bold">Instructor:</p>
        <p>{instructor.fullName}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Price:</p>
        <p>${course.price}</p>
      </div>

      <div className="flex gap-2">
        <p className="font-bold">Level:</p>
        <p>{level?.name}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="font-bold">Description:</p>
        <ReadText value={course.description!} />
      </div>
    </div>
  );
};

export default CourseOverview;
