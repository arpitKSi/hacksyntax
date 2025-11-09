import SectionsDetails from "@/components/sections/SectionsDetails";
import { db } from "@/lib/db";
import { getServerUser } from "@/lib/server-auth";
import { Resource } from "@prisma/client";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({
  params,
}: {
  params: { courseId: string; sectionId: string };
}) => {
  const { courseId, sectionId } = params;

  const user = await getServerUser();

  if (!user) {
    redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  const isOwner = user.role === "ADMIN" || course.instructorId === user.id;

  if (!course.isPublished && !isOwner) {
    redirect("/");
  }

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      courseId,
    },
  });

  if (!section) {
    redirect(`/courses/${courseId}/overview`);
  }

  if (!section.isPublished && !isOwner) {
    redirect(`/courses/${courseId}/overview`);
  }

  const enrollment = await db.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId: user.id,
        courseId,
      },
    },
  });

  const purchase = await db.purchase.findUnique({
    where: {
      customerId_courseId: {
        customerId: user.id,
        courseId,
      },
    },
  });

  let muxData = null;
  let resources: Resource[] = [];

  if (section.isFree || purchase || enrollment || isOwner) {
    muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });
  }

  if (purchase || enrollment || isOwner) {
    resources = await db.resource.findMany({
      where: {
        sectionId,
      },
    });
  }

  const progress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: user.id,
        sectionId,
      },
    },
  });

  return (
    <SectionsDetails
      course={course}
      section={section}
      purchase={purchase}
      muxData={muxData}
      resources={resources}
      progress={progress}
    />
  );
};

export default SectionDetailsPage;
