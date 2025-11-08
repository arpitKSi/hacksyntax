"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageSquare,
  Search,
  Filter,
  TrendingUp,
  Pin,
  MessageCircle,
  ThumbsUp,
  Clock,
  BookOpen,
  Building2,
  Users,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function DiscussionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  // Mock data - will be replaced with real database queries
  const discussions = [
    {
      id: "1",
      title: "Understanding Binary Search Trees - Best Practices",
      category: "COURSE",
      courseName: "Data Structures & Algorithms",
      department: "Computer Science",
      author: "John Doe",
      authorAvatar: "/avatar_placeholder.jpg",
      replies: 24,
      views: 156,
      upvotes: 18,
      lastActivity: "2 hours ago",
      isPinned: true,
      tags: ["DSA", "Trees", "Algorithms"],
    },
    {
      id: "2",
      title: "Department Seminar on Machine Learning - Nov 15",
      category: "DEPARTMENT",
      department: "Computer Science",
      author: "Dr. Sarah Wilson",
      authorAvatar: "/avatar_placeholder.jpg",
      replies: 45,
      views: 234,
      upvotes: 32,
      lastActivity: "5 hours ago",
      isPinned: true,
      tags: ["Seminar", "ML", "Event"],
    },
    {
      id: "3",
      title: "Study Group for Final Exams - Year 3",
      category: "GENERAL",
      year: "Year 3",
      author: "Alice Johnson",
      authorAvatar: "/avatar_placeholder.jpg",
      replies: 12,
      views: 89,
      upvotes: 8,
      lastActivity: "1 day ago",
      isPinned: false,
      tags: ["Study Group", "Exams", "Year 3"],
    },
    {
      id: "4",
      title: "Database Normalization - Need Help with 3NF",
      category: "COURSE",
      courseName: "Database Management Systems",
      department: "Computer Science",
      author: "Bob Smith",
      authorAvatar: "/avatar_placeholder.jpg",
      replies: 8,
      views: 67,
      upvotes: 5,
      lastActivity: "3 hours ago",
      isPinned: false,
      tags: ["DBMS", "Normalization", "Help"],
    },
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "COURSE":
        return <BookOpen className="w-4 h-4" />
      case "DEPARTMENT":
        return <Building2 className="w-4 h-4" />
      case "GENERAL":
        return <Users className="w-4 h-4" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "COURSE":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "DEPARTMENT":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "GENERAL":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-12 h-12" />
                <h1 className="text-4xl font-bold">Discussion Forums</h1>
              </div>
              <p className="text-lg text-blue-100">
                Engage in academic discussions, ask questions, and collaborate with peers
              </p>
            </div>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 font-bold">
              <Plus className="w-5 h-5 mr-2" />
              Start Discussion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="all">All Discussions</TabsTrigger>
            <TabsTrigger value="COURSE">Course Topics</TabsTrigger>
            <TabsTrigger value="DEPARTMENT">Department</TabsTrigger>
            <TabsTrigger value="GENERAL">General</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:col-span-1 p-6 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="COURSE">Course Topics</SelectItem>
                    <SelectItem value="DEPARTMENT">Department</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Department/Branch</label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="CSE">Computer Science</SelectItem>
                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select defaultValue="recent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                    <SelectItem value="unanswered">Unanswered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Discussions List */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">
                {discussions.length} Discussions
              </h2>
              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              </div>
            </div>

            {discussions.map((discussion) => (
              <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
                <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-green-300">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {discussion.author.charAt(0)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {discussion.isPinned && (
                              <Pin className="w-4 h-4 text-orange-500" />
                            )}
                            <h3 className="text-lg font-bold hover:text-green-600 transition-colors">
                              {discussion.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-sm text-gray-600 dark:text-gray-400">
                            <Badge variant="outline" className={getCategoryColor(discussion.category)}>
                              {getCategoryIcon(discussion.category)}
                              <span className="ml-1">{discussion.category}</span>
                            </Badge>
                            {discussion.courseName && (
                              <span>• {discussion.courseName}</span>
                            )}
                            {discussion.department && (
                              <span>• {discussion.department}</span>
                            )}
                            {discussion.year && (
                              <span>• {discussion.year}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{discussion.author}</span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {discussion.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {discussion.upvotes} upvotes
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {discussion.lastActivity}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}

            {/* Empty State */}
            {discussions.length === 0 && (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No discussions found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Be the first to start a conversation!
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Discussion
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
