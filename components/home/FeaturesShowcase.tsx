"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Users,
  MessageSquare,
  FileQuestion,
  FileText,
  Award,
  BarChart3,
  Library,
  Calendar,
  Building2,
  Search,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Target,
  Lightbulb,
  Video,
  Download,
  UserCheck,
} from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  badge?: string
  color: string
}

function FeatureCard({ icon, title, description, href, badge, color }: FeatureCardProps) {
  const router = useRouter()
  
  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-300 p-6 h-full border-2 hover:border-blue-300 cursor-pointer"
      onClick={() => router.push(href)}
    >
      <div className="flex flex-col h-full">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
          {description}
        </p>
        <div className="mt-4 text-blue-600 text-sm font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center">
          Explore →
        </div>
      </div>
    </Card>
  )
}

interface Department {
  id: string
  name: string
  code: string
}

interface FeaturesShowcaseProps {
  departments: Department[]
  isSignedIn: boolean
}

export default function FeaturesShowcase({ departments, isSignedIn }: FeaturesShowcaseProps) {
  const learningFeatures = [
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: "Browse Courses",
      description: "Explore our comprehensive catalog of courses across multiple disciplines and skill levels",
      href: "/",
      color: "bg-blue-600",
    },
    {
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Advanced Search",
      description: "Find the perfect course with powerful search and filtering by category, level, and instructor",
      href: "/search",
      color: "bg-purple-600",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Faculty Directory",
      description: "Discover our expert educators, view their profiles, courses, and research contributions",
      href: "/educators",
      color: "bg-green-600",
    },
    {
      icon: <Target className="w-6 h-6 text-white" />,
      title: "My Dashboard",
      description: "Track your learning progress, assignments, and achievements in one personalized view",
      href: "/dashboard",
      color: "bg-orange-600",
      badge: isSignedIn ? undefined : "Login Required",
    },
  ]

  const academicFeatures = [
    {
      icon: <FileQuestion className="w-6 h-6 text-white" />,
      title: "Quizzes & Tests",
      description: "Test your knowledge with interactive quizzes and assessments for each course section",
      href: "/quizzes",
      color: "bg-pink-600",
      badge: "Coming Soon",
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Assignments",
      description: "Submit assignments, get feedback, and track your grades throughout the semester",
      href: "/assignments",
      color: "bg-indigo-600",
      badge: "Coming Soon",
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "Certificates",
      description: "Earn verified certificates upon course completion to showcase your achievements",
      href: "/certificates",
      color: "bg-yellow-600",
      badge: isSignedIn ? undefined : "Login Required",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: "Performance Analytics",
      description: "Get detailed insights into your learning patterns, strengths, and areas for improvement",
      href: "/analytics",
      color: "bg-red-600",
      badge: isSignedIn ? undefined : "Login Required",
    },
  ]

  const collaborationFeatures = [
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: "Discussion Forum",
      description: "Engage in course discussions, department forums, and general academic conversations",
      href: "/discussions",
      color: "bg-teal-600",
    },
    {
      icon: <Library className="w-6 h-6 text-white" />,
      title: "Resource Library",
      description: "Access shared lecture notes, slides, research papers, and learning materials",
      href: "/resources",
      color: "bg-cyan-600",
    },
    {
      icon: <Video className="w-6 h-6 text-white" />,
      title: "Video Lectures",
      description: "Watch high-quality video lectures and tutorials from expert instructors",
      href: "/lectures",
      color: "bg-violet-600",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-white" />,
      title: "Study Groups",
      description: "Join or create study groups with classmates for collaborative learning",
      href: "/study-groups",
      color: "bg-lime-600",
      badge: "Coming Soon",
    },
  ]

  const departmentFeatures = [
    {
      icon: <Building2 className="w-6 h-6 text-white" />,
      title: "Departments",
      description: "Explore academic departments, faculty, courses, and research activities",
      href: "/departments",
      color: "bg-slate-600",
    },
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      title: "Academic Calendar",
      description: "Stay updated with important dates, events, and academic schedules",
      href: "/calendar",
      color: "bg-amber-600",
      badge: "Coming Soon",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: "Research Corner",
      description: "Discover ongoing research projects, publications, and innovation initiatives",
      href: "/research",
      color: "bg-emerald-600",
    },
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "Career Services",
      description: "Access career guidance, placement support, and industry connections",
      href: "/career",
      color: "bg-rose-600",
      badge: "Coming Soon",
    },
  ]

  return (
    <div className="space-y-12 mt-12">
      {/* Learning Features */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Learning & Discovery
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start your learning journey with our comprehensive course catalog and expert instructors
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Academic Features */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-purple-600" />
            Academic Excellence
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Enhance your skills with quizzes, assignments, and track your academic performance
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {academicFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Collaboration Features */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-600" />
            Collaboration & Resources
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with peers, access shared resources, and participate in discussions
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collaborationFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Department & Services */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-orange-600" />
            Departments & Services
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore academic departments, research initiatives, and career opportunities
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {departmentFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Department Quick Access */}
      {departments.length > 0 && (
        <section className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              Browse by Department
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quick access to courses, faculty, and discussions by department
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept) => (
              <Link key={dept.id} href={`/departments/${dept.id}`}>
                <Card className="p-4 hover:shadow-lg transition-all hover:scale-105 cursor-pointer text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600">
                      {dept.code.substring(0, 2)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{dept.code}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{dept.name}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Discussion Categories Quick Access */}
      <section className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-600" />
            Discussion Forums
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Join conversations organized by subject, branch, and year
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/discussions?category=COURSE">
            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-blue-400">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Course Discussions</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Subject-specific discussions for each enrolled course
              </p>
              <div className="mt-4 text-blue-600 font-semibold">
                Browse by Subject →
              </div>
            </Card>
          </Link>

          <Link href="/discussions?category=DEPARTMENT">
            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-purple-400">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Department Forums</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Branch-wise discussions for your department community
              </p>
              <div className="mt-4 text-purple-600 font-semibold">
                Browse by Branch →
              </div>
            </Card>
          </Link>

          <Link href="/discussions?category=GENERAL">
            <Card className="p-6 hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 hover:border-green-400">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">General Discussions</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Year-wise and campus-wide general topics and announcements
              </p>
              <div className="mt-4 text-green-600 font-semibold">
                Browse by Year →
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
            <p className="text-gray-600 dark:text-gray-400">Active Courses</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
            <p className="text-gray-600 dark:text-gray-400">Expert Faculty</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
            <p className="text-gray-600 dark:text-gray-400">Students Enrolled</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
            <p className="text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </section>
    </div>
  )
}
