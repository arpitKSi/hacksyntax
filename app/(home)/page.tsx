import { db } from "@/lib/db";
import getCoursesByCategory from "../actions/getCourses";
import Categories from "@/components/custom/Categories";
import EnhancedCourseCard from "@/components/courses/EnhancedCourseCard";
import EducatorCard from "@/components/educators/EducatorCard";
import FeaturesShowcase from "@/components/home/FeaturesShowcase";
import { auth } from "@/shims/clerk-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowRight, Users, Shield } from "lucide-react";

export default async function Home() {
  const { userId } = auth();

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      subCategories: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  const courses = await getCoursesByCategory(null);

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
  });

  // Fetch featured educators (top-rated or most courses)
  const featuredEducators = await db.user.findMany({
    where: {
      role: "EDUCATOR",
    },
    include: {
      department: true,
      _count: {
        select: {
          coursesCreated: true,
        },
      },
    },
    orderBy: [
      { totalRatings: "desc" },
      { rating: "desc" },
    ],
    take: 4,
  });
  
  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      {/* Hero Section */}
      {userId && (
        <div className="bg-gradient-to-r from-[#FDAB04] via-[#FD8A04] to-[#FD6A04] rounded-2xl p-10 mb-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Your Learning Journey! 🚀</h1>
          <p className="text-xl mb-6 text-white/90">Explore courses, track your progress, and achieve your learning goals.</p>
          <div className="flex gap-4 flex-wrap">
            <Button size="lg" variant="default" className="bg-white text-[#FDAB04] hover:bg-gray-100 font-bold" asChild>
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#FDAB04] font-bold" asChild>
              <Link href="/learning">
                My Learning
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#FDAB04] font-bold" asChild>
              <Link href="/discussions">
                Discussion Forum
              </Link>
            </Button>
          </div>
        </div>
      )}

      {!userId && (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-12 mb-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 text-white">Transform Your Skills with Expert-Led Courses</h1>
            <p className="text-2xl mb-8 text-white/90">Join thousands of learners mastering new skills every day</p>
          </div>
          
          {/* Role-based CTA Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm a Student</h3>
                <p className="text-white/80 text-sm mb-4">
                  Access courses, track progress, earn certificates
                </p>
                <Button className="w-full bg-white text-blue-600 hover:bg-gray-100 font-bold" asChild>
                  <Link href="/sign-up">
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm an Educator</h3>
                <p className="text-white/80 text-sm mb-4">
                  Share knowledge, create courses, inspire students
                </p>
                <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold" asChild>
                  <Link href="/sign-up">
                    Start Teaching
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm an Admin</h3>
                <p className="text-white/80 text-sm mb-4">
                  Manage platform, users, and system settings
                </p>
                <Button className="w-full bg-white text-orange-600 hover:bg-gray-100 font-bold" asChild>
                  <Link href="/sign-up">
                    Admin Access
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-white/90 text-lg mb-4">
              Already have an account?
            </p>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg px-12" asChild>
              <Link href="/sign-in">
                Sign In
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Comprehensive Features Showcase */}
      <FeaturesShowcase departments={departments} isSignedIn={!!userId} />

      {/* Browse by Category */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Browse Courses by Category</h2>
        <Categories categories={categories} selectedCategory={null} />
      </div>
      
      {/* Featured Educators Section */}
      {featuredEducators.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Featured Educators</h2>
            </div>
            <Link href="/educators">
              <Button variant="outline" size="lg">
                View All Educators
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEducators.map((educator) => (
              <EducatorCard key={educator.id} educator={educator} />
            ))}
          </div>
        </div>
      )}

      {/* Featured Courses */}
      <div className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Featured Courses</h2>
          <Link href="/search">
            <Button variant="outline" size="lg">
              Browse All Courses
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="flex flex-wrap gap-7 justify-center">
          {courses.slice(0, 8).map((course) => (
            <EnhancedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
      
    </div>
  );
}
