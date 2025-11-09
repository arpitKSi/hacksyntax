import EditCourseForm from "@/components/courses/EditCourseForm";
import AlertBanner from "@/components/custom/AlertBanner";
import { db } from "@/lib/db";
import { requireServerAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";

const CourseBasics = async ({ params }: { params: { courseId: string } }) => {
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
      sections: true,
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  const levels = await db.level.findMany();

  const completionChecks = [
    Boolean(course.title?.trim()),
    Boolean(course.description?.trim()),
    Boolean(course.categoryId),
    Boolean(course.subCategoryId),
    Boolean(course.levelId),
    Boolean(course.imageUrl),
    course.sections.some((section) => section.isPublished),
  ];

  const requiredFieldsCount = completionChecks.length;
  const missingFieldsCount = completionChecks.filter((isComplete) => !isComplete).length;
  const isCompleted = missingFieldsCount === 0;

  return (
    <div className="px-10">
      <AlertBanner
        isCompleted={isCompleted}
        missingFieldsCount={missingFieldsCount}
        requiredFieldsCount={requiredFieldsCount}
      />
      <EditCourseForm
        course={course}
        categories={categories.map((category) => ({
          label: category.name,
          value: category.id,
          subCategories: category.subCategories.map((subcategory) => ({
            label: subcategory.name,
            value: subcategory.id,
          })),
        }))}
        levels={levels.map((level) => ({
          label: level.name,
          value: level.id,
        }))}
        isCompleted={isCompleted}
      />
    </div>
  );
};

export default CourseBasics;
