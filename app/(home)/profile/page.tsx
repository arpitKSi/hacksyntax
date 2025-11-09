import { redirect } from "next/navigation";

import ProfileDashboard, {
  ProfileData,
} from "@/components/profile/ProfileDashboard";
import { db } from "@/lib/db";
import { requireServerAuth } from "@/lib/server-auth";

const ProfilePage = async () => {
  const authUser = await requireServerAuth().catch(() => null);

  if (!authUser) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: { id: authUser.id },
    include: {
      department: true,
      coursesCreated: {
        include: {
          department: true,
        },
        orderBy: {
          createdAt: "desc",
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
        orderBy: {
          enrolledAt: "desc",
        },
      },
    },
  });

  if (!user) {
    return redirect("/sign-in");
  }

  const profileData: ProfileData = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    department: user.department
      ? { id: user.department.id, name: user.department.name, code: user.department.code }
      : null,
    designation: user.designation,
    facultyId: user.facultyId,
    specialization: user.specialization,
    bio: user.bio,
    contactInfo: user.contactInfo,
    officeHours: user.officeHours,
    enrollmentId: user.enrollmentId,
    year: user.year,
    researchInterests: user.researchInterests ? JSON.parse(user.researchInterests) : [],
    publications: user.publications ? JSON.parse(user.publications) : [],
    rating: user.rating,
    totalRatings: user.totalRatings,
    coursesCreated: user.coursesCreated.map((course) => ({
      id: course.id,
      title: course.title,
      imageUrl: course.imageUrl,
      createdAt: course.createdAt.toISOString(),
      isPublished: course.isPublished,
    })),
    enrollments: user.enrollments.map((enrollment) => ({
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt.toISOString(),
      progress: enrollment.progress,
      isCompleted: enrollment.isCompleted,
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        imageUrl: enrollment.course.imageUrl,
      },
    })),
  };

  return <ProfileDashboard profile={profileData} />;
};

export default ProfilePage;
