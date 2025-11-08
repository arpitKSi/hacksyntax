"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import {
  GraduationCap,
  Users,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import { toast } from "react-hot-toast"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState("student")

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    enrollmentId: "",
    designation: "",
    facultyId: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters!")
      return
    }

    setIsLoading(true)

    try {
      // Simulate registration - Replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mark user as signed in (for demo purposes)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_signed_out')
      }

      toast.success(`Account created successfully as ${activeRole}!`)
      
      // Redirect to onboarding based on role
      if (activeRole === "student") {
        router.push("/onboarding/student")
      } else if (activeRole === "educator") {
        router.push("/onboarding/educator")
      } else {
        router.push("/admin/dashboard")
      }
    } catch (error) {
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const roleConfig = {
    student: {
      icon: <GraduationCap className="w-6 h-6" />,
      color: "blue",
      title: "Student Registration",
      description: "Join thousands of students learning every day",
      bgGradient: "from-blue-500 to-cyan-500",
      benefits: [
        "Access 500+ courses",
        "Track your progress",
        "Earn certificates",
        "Join study groups",
      ],
    },
    educator: {
      icon: <Users className="w-6 h-6" />,
      color: "purple",
      title: "Educator Registration",
      description: "Share your knowledge and inspire students",
      bgGradient: "from-purple-500 to-pink-500",
      benefits: [
        "Create unlimited courses",
        "Track student progress",
        "Share research materials",
        "Build your profile",
      ],
    },
    admin: {
      icon: <Shield className="w-6 h-6" />,
      color: "orange",
      title: "Admin Registration",
      description: "Manage the entire platform",
      bgGradient: "from-orange-500 to-red-500",
      benefits: [
        "Manage all users",
        "Configure departments",
        "Monitor analytics",
        "System settings",
      ],
    },
  }

  const currentRole = roleConfig[activeRole as keyof typeof roleConfig]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start py-8">
        {/* Left Side - Branding & Benefits */}
        <div className="hidden lg:block sticky top-8">
          <div className="space-y-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="College Academy"
                width={250}
                height={50}
                className="mb-8"
              />
            </Link>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Start Your Journey! 🚀
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Create your account and unlock access to world-class education
            </p>
            
            {/* Role-specific benefits */}
            <div className="space-y-3 pt-6">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {currentRole.title} Benefits:
              </h3>
              {currentRole.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentRole.bgGradient} flex items-center justify-center`}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{benefit}</p>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-500">Faculty</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">10K+</div>
                <div className="text-sm text-gray-500">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <Card className="p-8 shadow-2xl">
          {/* Role Tabs */}
          <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student">
                <GraduationCap className="w-4 h-4 mr-2" />
                Student
              </TabsTrigger>
              <TabsTrigger value="educator">
                <Users className="w-4 h-4 mr-2" />
                Educator
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Header */}
          <div className={`bg-gradient-to-r ${currentRole.bgGradient} text-white p-6 rounded-lg mb-6`}>
            <div className="flex items-center gap-3 mb-2">
              {currentRole.icon}
              <h2 className="text-2xl font-bold">{currentRole.title}</h2>
            </div>
            <p className="text-white/90 text-sm">{currentRole.description}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder={`${activeRole}@college.edu`}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department">Department</Label>
              <div className="relative mt-1">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                    <SelectItem value="EE">Electrical Engineering</SelectItem>
                    <SelectItem value="ME">Mechanical Engineering</SelectItem>
                    <SelectItem value="CE">Civil Engineering</SelectItem>
                    <SelectItem value="ECE">Electronics & Communication</SelectItem>
                    <SelectItem value="MBA">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Role-specific fields */}
            {activeRole === "student" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="enrollmentId">Enrollment ID</Label>
                  <Input
                    id="enrollmentId"
                    placeholder="2024CS001"
                    value={formData.enrollmentId}
                    onChange={(e) => setFormData({ ...formData, enrollmentId: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeRole === "educator" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Select
                    value={formData.designation}
                    onValueChange={(value) => setFormData({ ...formData, designation: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="facultyId">Faculty ID</Label>
                  <Input
                    id="facultyId"
                    placeholder="FAC001"
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input type="checkbox" className="rounded mt-1" required />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${currentRole.bgGradient} hover:opacity-90 text-white font-semibold text-lg py-6`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}