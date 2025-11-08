"use client"

import { useState, useMemo } from "react"
import EducatorCard from "@/components/educators/EducatorCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Search, Filter, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Department {
  id: string
  name: string
  code: string
}

interface Educator {
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

interface EducatorDirectoryClientProps {
  educators: Educator[]
  departments: Department[]
}

export default function EducatorDirectoryClient({
  educators,
  departments,
}: EducatorDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedDesignation, setSelectedDesignation] = useState<string>("all")
  const [minRating, setMinRating] = useState<string>("0")

  // Get unique designations
  const designations = useMemo(() => {
    const uniqueDesignations = new Set<string>()
    educators.forEach((educator) => {
      if (educator.designation) {
        uniqueDesignations.add(educator.designation)
      }
    })
    return Array.from(uniqueDesignations).sort()
  }, [educators])

  // Filter educators
  const filteredEducators = useMemo(() => {
    return educators.filter((educator) => {
      // Search filter
      const fullName = `${educator.firstName || ""} ${educator.lastName || ""}`.toLowerCase()
      const designation = (educator.designation || "").toLowerCase()
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch =
        fullName.includes(searchLower) || designation.includes(searchLower)

      // Department filter
      const matchesDepartment =
        selectedDepartment === "all" ||
        educator.department?.name === selectedDepartment

      // Designation filter
      const matchesDesignation =
        selectedDesignation === "all" ||
        educator.designation === selectedDesignation

      // Rating filter
      const avgRating =
        educator.totalRatings > 0 && educator.rating
          ? educator.rating / educator.totalRatings
          : 0
      const matchesRating = avgRating >= parseFloat(minRating)

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesDesignation &&
        matchesRating
      )
    })
  }, [educators, searchQuery, selectedDepartment, selectedDesignation, minRating])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Faculty Directory</h1>
          </div>
          <p className="text-lg text-blue-100">
            Explore our distinguished faculty members and their expertise
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <Label htmlFor="search" className="mb-2 block">
                  Search Educators
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Name or designation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Department Filter */}
              <div>
                <Label htmlFor="department" className="mb-2 block">
                  Department
                </Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Designation Filter */}
              <div>
                <Label htmlFor="designation" className="mb-2 block">
                  Designation
                </Label>
                <Select
                  value={selectedDesignation}
                  onValueChange={setSelectedDesignation}
                >
                  <SelectTrigger id="designation">
                    <SelectValue placeholder="All Designations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Designations</SelectItem>
                    {designations.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rating Filter */}
              <div>
                <Label htmlFor="rating" className="mb-2 block">
                  Minimum Rating
                </Label>
                <Select value={minRating} onValueChange={setMinRating}>
                  <SelectTrigger id="rating">
                    <SelectValue placeholder="Any Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Count */}
              {(searchQuery || selectedDepartment !== "all" || selectedDesignation !== "all" || minRating !== "0") && (
                <div className="pt-4 border-t">
                  <Badge variant="secondary" className="w-full justify-center">
                    {filteredEducators.length} {filteredEducators.length === 1 ? "Result" : "Results"}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Educators Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Educators ({filteredEducators.length})
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Browse through our talented faculty members
              </p>
            </div>

            {filteredEducators.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No educators found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your filters to see more results
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEducators.map((educator) => (
                  <EducatorCard key={educator.id} educator={educator} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
