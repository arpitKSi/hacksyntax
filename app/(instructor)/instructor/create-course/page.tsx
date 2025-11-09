import { redirect } from "next/navigation";

import CreateCourseForm from "@/components/courses/CreateCourseForm";
import { db } from "@/lib/db";
import { requireServerAuth } from "@/lib/server-auth";

const CreateCoursePage = async () => {
  const authUser = await requireServerAuth().catch(() => null);

  if (!authUser) {
    return redirect("/sign-in");
  }

  if (!["EDUCATOR", "ADMIN"].includes(authUser.role)) {
    return redirect("/dashboard");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: true,
    },
  });

  return (
    <div>
      <CreateCourseForm
        categories={categories.map((category) => ({
          label: category.name,
          value: category.id,
          subCategories: category.subCategories.map((subcategory) => ({
            label: subcategory.name,
            value: subcategory.id,
          })),
        }))}
      />
    </div>
  );
};

export default CreateCoursePage;