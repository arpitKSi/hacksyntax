import { redirect } from "next/navigation";

import CreateSectionForm from "@/components/sections/CreateSectionForm";
import { db } from "@/lib/db";
import { requireServerAuth } from "@/lib/server-auth";

const CourseCurriculumPage = async ({ params }: { params: { courseId: string } }) => {
  const authUser = await requireServerAuth().catch(() => null);

  if (!authUser) {
    return redirect("/sign-in");
  }

  if (!["EDUCATOR", "ADMIN"].includes(authUser.role)) {
    return redirect("/dashboard");
  }

  const course = await db.course.findUnique({
    where:
      authUser.role === "ADMIN"
        ? { id: params.courseId }
        : {
            id: params.courseId,
            instructorId: authUser.id,
          },
    include: {
      sections: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  return <CreateSectionForm course={course} />;
};

export default CourseCurriculumPage;