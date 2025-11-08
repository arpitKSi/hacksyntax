import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Mail, Clock, BookOpen, Star, Award, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EnhancedCourseCard from "@/components/courses/EnhancedCourseCard";
import EducatorContentUpload from "@/components/educators/EducatorContentUpload";
import { auth } from "@/shims/clerk-server";

interface EducatorProfilePageProps {
  params: {
    educatorId: string;
  };
}

export default async function EducatorProfilePage({ params }: EducatorProfilePageProps) {
  const { userId } = auth();
  
  // Fetch educator details
  const educator = await db.user.findUnique({
    where: {
      id: params.educatorId,
      role: "EDUCATOR",
    },
    include: {
      department: true,
      coursesCreated: {
        where: {
          isPublished: true,
        },
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
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      ratings: {
        include: {
          course: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      sharedMaterials: {
        where: {
          isPublic: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!educator) {
    return notFound();
  }

  // Check if current user can edit
  const currentUser = userId
    ? await db.user.findUnique({ where: { clerkId: userId } })
    : null;
  const canEdit =
    currentUser && (currentUser.id === educator.id || currentUser.role === "ADMIN");

  const researchInterests = educator.researchInterests
    ? JSON.parse(educator.researchInterests)
    : [];
  const publications = educator.publications ? JSON.parse(educator.publications) : [];

  const fullName = `${educator.firstName || ""} ${educator.lastName || ""}`.trim();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#FDAB04] to-[#FFF8EB] dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image
                src={educator.imageUrl || "/avatar_placeholder.jpg"}
                alt={fullName}
                width={200}
                height={200}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {fullName}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-4">
                {educator.designation && (
                  <Badge className="bg-white text-gray-900 text-base px-3 py-1">
                    {educator.designation}
                  </Badge>
                )}
                {educator.department && (
                  <Badge variant="outline" className="text-base px-3 py-1 border-white text-gray-900">
                    {educator.department.name}
                  </Badge>
                )}
                {educator.facultyId && (
                  <Badge variant="outline" className="text-base px-3 py-1 border-white text-gray-900">
                    Faculty ID: {educator.facultyId}
                  </Badge>
                )}
              </div>

              {/* Rating */}
              {educator.rating && educator.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{educator.rating.toFixed(1)}</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      ({educator.totalRatings} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg">
                    <BookOpen className="h-5 w-5 text-[#FDAB04]" />
                    <span className="font-semibold">{educator.coursesCreated.length} Courses</span>
                  </div>
                </div>
              )}

              {/* Specialization */}
              {educator.specialization && (
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                  <strong>Specialization:</strong> {educator.specialization}
                </p>
              )}

              {/* Bio */}
              {educator.bio && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {educator.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contact & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {educator.email && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <a
                      href={`mailto:${educator.email}`}
                      className="text-[#FDAB04] hover:underline"
                    >
                      {educator.email}
                    </a>
                  </div>
                )}
                {educator.contactInfo && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Additional Contact</p>
                    <p className="text-gray-900 dark:text-white">{educator.contactInfo}</p>
                  </div>
                )}
                {educator.officeHours && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Office Hours
                    </p>
                    <p className="text-gray-900 dark:text-white">{educator.officeHours}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Research Interests */}
            {researchInterests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Research Interests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {researchInterests.map((interest: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Publications */}
            {publications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Publications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {publications.map((pub: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        • {pub}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Courses & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shared Materials */}
            <EducatorContentUpload
              educatorId={params.educatorId}
              materials={educator.sharedMaterials || []}
              canEdit={canEdit || false}
            />

            {/* Courses Taught */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-[#FDAB04]" />
                Courses Taught ({educator.coursesCreated.length})
              </h2>
              
              {educator.coursesCreated.length > 0 ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {educator.coursesCreated.map((course) => (
                    <EnhancedCourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    No published courses yet
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Student Feedback */}
            {educator.ratings.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Star className="h-6 w-6 text-[#FDAB04]" />
                  Student Feedback
                </h2>
                <div className="space-y-4">
                  {educator.ratings.map((rating) => (
                    <Card key={rating.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= rating.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {rating.course.title}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {rating.review && (
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {rating.review}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
