import { db } from "@/lib/db"
import EducatorDirectoryClient from "@/components/educators/EducatorDirectoryClient"

export default async function EducatorsPage() {
  // Fetch all educators
  const educators = await db.user.findMany({
    where: {
      role: "EDUCATOR",
    },
    include: {
      department: {
        select: {
          name: true,
          code: true,
        },
      },
      _count: {
        select: {
          coursesCreated: true,
        },
      },
    },
    orderBy: [
      { totalRatings: "desc" },
      { rating: "desc" },
      { firstName: "asc" },
    ],
  })

  // Fetch all departments
  const departments = await db.department.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  })

  return <EducatorDirectoryClient educators={educators} departments={departments} />
}
