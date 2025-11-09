import { db } from "@/lib/db";
import {
  asyncHandler,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  successResponse,
} from "@/lib/errors";
import { parseBody, requireAuth } from "@/lib/api-middleware";

type EducatorOnboardingPayload = {
  userId?: string;
  firstName?: string;
  lastName?: string;
  departmentId?: string;
  designation?: string;
  facultyId?: string;
  bio?: string;
  specialization?: string;
  officeHours?: string;
};

export const POST = asyncHandler(async (req: Request) => {
  const authUser = await requireAuth(req);
  const payload = await parseBody<EducatorOnboardingPayload>(req);

  if (payload.userId && payload.userId !== authUser.id) {
    throw new ForbiddenError("You can only update your own profile");
  }

  const {
    firstName,
    lastName,
    departmentId,
    designation,
    facultyId,
    bio,
    specialization,
    officeHours,
  } = payload;

  if (!firstName || !lastName || !departmentId || !designation || !facultyId) {
    throw new BadRequestError("Missing required fields");
  }

  const department = await db.department.findUnique({
    where: { id: departmentId },
    select: { id: true },
  });

  if (!department) {
    throw new NotFoundError("Department not found");
  }

  const updatedUser = await db.user.update({
    where: { id: authUser.id },
    data: {
      firstName,
      lastName,
      departmentId,
      designation,
      facultyId,
      bio,
      specialization,
      officeHours,
      role: authUser.role === "ADMIN" ? "ADMIN" : "EDUCATOR",
      isOnboarded: true,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      departmentId: true,
      designation: true,
      facultyId: true,
      bio: true,
      specialization: true,
      officeHours: true,
      isOnboarded: true,
    },
  });

  return successResponse({ user: updatedUser });
});
