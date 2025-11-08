import { db } from "@/lib/db"

const getCoursesByCategory = async (categoryId: string | null) => {
  const whereClause: any = {
    ...(categoryId ? { categoryId, isPublished: true } : { isPublished: true }),
  }
  const courses = await db.course.findMany({
    where: whereClause,
    include: {
      category: true,
      subCategory: true,
      level: true,
      department: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
          designation: true,
          departmentId: true,
        },
      },
      sections: {
        where: {
          isPublished: true,
        }
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return courses
}

export default getCoursesByCategory