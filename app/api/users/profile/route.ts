import { db } from "@/lib/db";
import { updateProfileSchema } from "@/lib/validations";
import {
  asyncHandler,
  successResponse,
  NotFoundError,
} from "@/lib/errors";
import { requireAuth, parseBody } from "@/lib/api-middleware";

/**
 * GET /api/users/profile
 * Get current user profile
 */
export const GET = asyncHandler(async (req: Request) => {
  const currentUser = await requireAuth(req);

  const user = await db.user.findUnique({
    where: { id: currentUser.id },
    include: {
      department: true,
      coursesCreated: {
        where: { isPublished: true },
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
      },
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return successResponse({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    imageUrl: user.imageUrl,
    bio: user.bio,
    specialization: user.specialization,
    contactInfo: user.contactInfo,
    departmentId: user.departmentId,
    department: user.department,
    enrollmentId: user.enrollmentId,
    year: user.year,
    designation: user.designation,
    facultyId: user.facultyId,
    researchInterests: user.researchInterests ? JSON.parse(user.researchInterests) : [],
    publications: user.publications ? JSON.parse(user.publications) : [],
    officeHours: user.officeHours,
    rating: user.rating,
    totalRatings: user.totalRatings,
    isOnboarded: user.isOnboarded,
    coursesCreated: user.coursesCreated,
    enrollments: user.enrollments,
  });
});

/**
 * PATCH /api/users/profile
 * Update current user profile
 */
export const PATCH = asyncHandler(async (req: Request) => {
  const currentUser = await requireAuth(req);

  const body = await parseBody(req);
  const validatedData = updateProfileSchema.parse(body);

  // Prepare update data
  const updateData: any = { ...validatedData };

  // Convert arrays to JSON strings
  if (validatedData.researchInterests) {
    updateData.researchInterests = JSON.stringify(validatedData.researchInterests);
  }

  if (validatedData.publications) {
    updateData.publications = JSON.stringify(validatedData.publications);
  }

  // Update user
  const user = await db.user.update({
    where: { id: currentUser.id },
    data: updateData,
    include: {
      department: true,
    },
  });

  return successResponse({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    imageUrl: user.imageUrl,
    bio: user.bio,
    specialization: user.specialization,
    contactInfo: user.contactInfo,
    department: user.department,
    researchInterests: user.researchInterests ? JSON.parse(user.researchInterests) : [],
    publications: user.publications ? JSON.parse(user.publications) : [],
    officeHours: user.officeHours,
  });
});
