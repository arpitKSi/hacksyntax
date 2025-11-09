import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { DataTable } from "@/components/custom/DataTable";
import { columns } from "@/components/courses/Columns";
import { requireServerAuth } from "@/lib/server-auth";

const CoursesPage = async () => {
  const authUser = await requireServerAuth().catch(() => null);

  if (!authUser) {
    return redirect("/sign-in");
  }

  if (!["EDUCATOR", "ADMIN"].includes(authUser.role)) {
    return redirect("/dashboard");
  }

  const courses = await db.course.findMany({
    where:
      authUser.role === "ADMIN"
        ? {}
        : {
            instructorId: authUser.id,
          },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-5">
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
