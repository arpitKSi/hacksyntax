import { db } from "@/lib/db";
import { auth } from "@/shims/clerk-server";
import { redirect } from "next/navigation";
import { BookOpen, Award, TrendingUp, Clock, BookMarked, FileText, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedStatCard from "@/components/dashboard/EnhancedStatCard";
import DepartmentTab from "@/components/dashboard/DepartmentTab";
import AssignmentsDueWidget from "@/components/dashboard/AssignmentsDueWidget";
import RecentDiscussions from "@/components/dashboard/RecentDiscussions";

export default async function LearnerDashboard() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Get user with enrollments
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      department: {
        include: {
          headOfDepartment: true,
        }
      },
      enrollments: {
        include: {
          course: {
            include: {
              category: true,
              instructor: true,
              sections: {
                where: { isPublished: true }
              }
            }
          }
        },
        orderBy: {
          enrolledAt: "desc"
        }
      },
      certificates: {
        orderBy: {
          issuedDate: "desc"
        }
      },
      progress: {
        include: {
          section: {
            include: {
              course: true
            }
          }
        }
      }
    }
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Get department educators if user has department
  let departmentEducators: any[] = []
  if (user.departmentId) {
    departmentEducators = await db.user.findMany({
      where: {
        departmentId: user.departmentId,
        role: "EDUCATOR",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        designation: true,
        imageUrl: true,
        specialization: true,
      },
      orderBy: {
        firstName: "asc",
      }
    })
  }

  // Mock assignments data (will be real when Assignment model is used)
  const mockAssignments = [
    {
      id: "1",
      title: "Week 5 Programming Assignment",
      courseName: "Data Structures and Algorithms",
      courseId: "course1",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: "pending" as const,
      points: 100,
      earnedPoints: null,
    },
    {
      id: "2",
      title: "Research Paper on AI Ethics",
      courseName: "Artificial Intelligence",
      courseId: "course2",
      dueDate: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
      status: "pending" as const,
      points: 50,
      earnedPoints: null,
    },
    {
      id: "3",
      title: "Database Design Project",
      courseName: "Database Management Systems",
      courseId: "course3",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "pending" as const,
      points: 150,
      earnedPoints: null,
    },
  ]

  // Mock discussions data
  const mockDiscussions = [
    {
      id: "1",
      title: "Understanding Binary Search Trees",
      category: "COURSE" as const,
      courseName: "Data Structures and Algorithms",
      courseId: "course1",
      author: {
        firstName: "John",
        lastName: "Doe",
        imageUrl: "/avatar_placeholder.jpg",
      },
      commentsCount: 12,
      unreadCount: 3,
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isPinned: true,
    },
    {
      id: "2",
      title: "Department Seminar on Machine Learning",
      category: "DEPARTMENT" as const,
      departmentName: user.department?.name,
      author: {
        firstName: "Dr. Sarah",
        lastName: "Wilson",
        imageUrl: "/avatar_placeholder.jpg",
      },
      commentsCount: 24,
      unreadCount: 5,
      lastActivity: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isPinned: false,
    },
    {
      id: "3",
      title: "Career Guidance Session",
      category: "GENERAL" as const,
      author: {
        firstName: "Admin",
        lastName: "User",
        imageUrl: "/avatar_placeholder.jpg",
      },
      commentsCount: 8,
      unreadCount: 0,
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isPinned: false,
    },
  ]

  // Calculate statistics
  const totalEnrolled = user.enrollments.length;
  const completedCourses = user.enrollments.filter(e => e.isCompleted).length;
  const inProgressCourses = totalEnrolled - completedCourses;
  const totalCertificates = user.certificates.length;

  // Calculate total learning hours (mock calculation)
  const totalMinutesWatched = user.progress.reduce((sum, p) => sum + (p.watchTime / 60), 0);
  const totalHours = Math.floor(totalMinutesWatched / 60);

  // Calculate total credit hours (from completed courses)
  const totalCreditHours = user.enrollments
    .filter(e => e.isCompleted)
    .reduce((sum, e) => sum + (e.course.creditHours || 0), 0)

  // Mock GPA calculation
  const mockGPA = "3.75"

  // Count pending assignments
  const pendingAssignmentsCount = mockAssignments.filter(a => a.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.firstName || "Learner"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {user.department ? `${user.department.name} • Year ${user.year || 1}${user.branch ? ` • ${user.branch}` : ""}` : "Continue your learning journey"}
          </p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EnhancedStatCard
            icon={BookOpen}
            title="Enrolled Courses"
            value={totalEnrolled}
            subtitle={`${inProgressCourses} in progress`}
            color="bg-blue-500"
          />
          <EnhancedStatCard
            icon={Target}
            title="Current GPA"
            value={mockGPA}
            subtitle="Academic Performance"
            color="bg-green-500"
            trend={{ value: 5, isPositive: true }}
          />
          <EnhancedStatCard
            icon={BookMarked}
            title="Credit Hours"
            value={totalCreditHours}
            subtitle="Completed"
            color="bg-purple-500"
          />
          <EnhancedStatCard
            icon={FileText}
            title="Assignments Due"
            value={pendingAssignmentsCount}
            subtitle={pendingAssignmentsCount > 0 ? "Pending submission" : "All caught up!"}
            color={pendingAssignmentsCount > 0 ? "bg-red-500" : "bg-green-500"}
          />
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="department">My Department</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Assignments Due Widget */}
            <AssignmentsDueWidget assignments={mockAssignments} />

            {/* Continue Learning Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Continue Learning</h2>
              {user.enrollments.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet</p>
                  <Link 
                    href="/"
                    className="inline-block bg-[#FDAB04] text-white px-6 py-3 rounded-lg hover:bg-[#FDAB04]/80"
                  >
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.enrollments.slice(0, 6).map((enrollment) => (
                    <EnrolledCourseCard
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Certificates Section */}
            {user.certificates.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6">Your Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Award className="w-8 h-8 text-yellow-500" />
                        <div>
                          <h3 className="font-semibold">{cert.courseName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(cert.issuedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {cert.certificateUrl && (
                        <a
                          href={cert.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Certificate →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Department Tab */}
          <TabsContent value="department">
            {user.department ? (
              <DepartmentTab
                department={user.department}
                educators={departmentEducators}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">You haven't been assigned to a department yet.</p>
                <p className="text-sm text-gray-400 mt-2">Please contact the admin to set up your department.</p>
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <RecentDiscussions discussions={mockDiscussions} />

            {/* Recent Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Learning Activity</h3>
              {user.progress.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {user.progress.slice(0, 5).map((prog) => (
                    <div key={prog.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Clock className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{prog.section.course.title}</p>
                        <p className="text-sm text-gray-500 truncate">{prog.section.title}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(prog.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EnrolledCourseCard({ enrollment }: any) {
  const { course } = enrollment;
  
  return (
    <Link
      href={`/courses/${course.id}/overview`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-40">
        <Image
          src={course.imageUrl || "/image_placeholder.webp"}
          alt={course.title}
          fill
          className="object-cover"
        />
        {enrollment.progress > 0 && (
          <div className="absolute top-2 right-2 bg-white px-3 py-1 rounded-full text-sm font-semibold">
            {enrollment.progress}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {course.instructor.firstName} {course.instructor.lastName}
        </p>
        <Progress value={enrollment.progress} className="mb-2" />
        <p className="text-xs text-gray-500">
          {enrollment.isCompleted ? "Completed" : `${enrollment.progress}% Complete`}
        </p>
      </div>
    </Link>
  );
}
