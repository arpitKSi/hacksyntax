"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, BookOpen, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface EducatorCardProps {
  educator: {
    id: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    designation: string | null
    department: {
      name: string
      code: string
    } | null
    specialization: string | null
    rating: number | null
    totalRatings: number
    _count?: {
      coursesCreated: number
    }
  }
}

export default function EducatorCard({ educator }: EducatorCardProps) {
  const fullName = `${educator.firstName || ""} ${educator.lastName || ""}`.trim() || "Unknown Educator"
  const courseCount = educator._count?.coursesCreated || 0
  const avgRating = educator.totalRatings > 0 && educator.rating 
    ? (educator.rating / educator.totalRatings).toFixed(1) 
    : "0.0"

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-300">
      {/* Card Header with Background */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Profile Photo - Overlapping Header */}
      <div className="relative px-6 -mt-16 pb-4">
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white shadow-lg group-hover:scale-105 transition-transform">
            <Image
              src={educator.imageUrl || "/avatar_placeholder.jpg"}
              alt={fullName}
              fill
              className="object-cover"
            />
          </div>

          {/* Name and Designation */}
          <div className="text-center mt-4 mb-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {fullName}
            </h3>
            {educator.designation && (
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">
                {educator.designation}
              </p>
            )}
          </div>

          {/* Department Badge */}
          {educator.department && (
            <Badge variant="outline" className="mb-3 border-blue-500 text-blue-700 dark:text-blue-400">
              {educator.department.name}
            </Badge>
          )}

          {/* Specialization */}
          {educator.specialization && (
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-4 line-clamp-2 px-2">
              {educator.specialization}
            </p>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 w-full mb-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {/* Course Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <BookOpen className="w-4 h-4" />
                <span className="font-bold text-lg">{courseCount}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {courseCount === 1 ? "Course" : "Courses"}
              </span>
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>

            {/* Rating */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">{avgRating}</span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {educator.totalRatings} {educator.totalRatings === 1 ? "Rating" : "Ratings"}
              </span>
            </div>
          </div>

          {/* View Profile Button */}
          <Link href={`/educators/${educator.id}`} className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold group-hover:shadow-lg transition-all">
              View Profile
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}
