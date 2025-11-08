"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, MapPin, Mail, Users, Megaphone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Educator {
  id: string
  firstName: string | null
  lastName: string | null
  designation: string | null
  imageUrl: string | null
  specialization: string | null
}

interface DepartmentTabProps {
  department: {
    id: string
    name: string
    code: string
    description: string | null
    headId: string | null
    contactEmail: string | null
    head: {
      id: string
      firstName: string | null
      lastName: string | null
      imageUrl: string | null
      designation: string | null
    } | null
  }
  educators: Educator[]
}

export default function DepartmentTab({ department, educators }: DepartmentTabProps) {
  return (
    <div className="space-y-6">
      {/* Department Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-2 border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold">{department.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Department Code: {department.code}</p>
              </div>
            </div>
            {department.description && (
              <p className="text-gray-700 dark:text-gray-300 mt-3">{department.description}</p>
            )}
          </div>
          {department.contactEmail && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Mail className="w-4 h-4" />
              <a href={`mailto:${department.contactEmail}`} className="hover:text-blue-600">
                {department.contactEmail}
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Department Head */}
      {department.head && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Department Head
          </h3>
          <Link
            href={`/educators/${department.head.id}`}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border"
          >
            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={department.head.imageUrl || "/avatar_placeholder.jpg"}
                alt={`${department.head.firstName} ${department.head.lastName}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-lg">
                {department.head.designation} {department.head.firstName} {department.head.lastName}
              </p>
              <p className="text-sm text-gray-500">Head of {department.name}</p>
            </div>
          </Link>
        </Card>
      )}

      {/* Faculty Members */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Faculty Members ({educators.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {educators.map((educator) => (
            <Link
              key={educator.id}
              href={`/educators/${educator.id}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border"
            >
              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={educator.imageUrl || "/avatar_placeholder.jpg"}
                  alt={`${educator.firstName} ${educator.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {educator.firstName} {educator.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{educator.designation || "Faculty"}</p>
                {educator.specialization && (
                  <p className="text-xs text-gray-400 truncate">{educator.specialization}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Department Announcements */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-orange-600" />
          Department Announcements
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Academic Calendar Updated</p>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              The mid-semester examination schedule has been announced. Please check your course pages for details.
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold">Guest Lecture Series</p>
              <span className="text-xs text-gray-500">5 days ago</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join us for an exciting guest lecture on emerging technologies this Friday at 3 PM in Hall A.
            </p>
          </div>
          <div className="text-center pt-2">
            <Button variant="link" className="text-blue-600">
              View All Announcements →
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
