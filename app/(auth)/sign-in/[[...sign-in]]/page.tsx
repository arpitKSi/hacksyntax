"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ArrowRight,
} from "lucide-react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { authHelpers, extractApiData } from "@/lib/api-client"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState("student")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call actual login API
      const response = await axios.post("/api/auth/signin", {
        email: formData.email,
        password: formData.password,
      })

      // Store tokens and user data
      const payload = extractApiData(response.data) as {
        accessToken?: string
        refreshToken?: string
        user?: any
      }

      const { accessToken, refreshToken, user } = payload

      if (!accessToken || !refreshToken || !user) {
        throw new Error("Invalid authentication response")
      }
      authHelpers.setTokens(accessToken, refreshToken)
      authHelpers.setUser(user)

      toast.success(`Welcome back, ${user.firstName}!`)
      
      // Redirect based on role
      if (user.role === "STUDENT" || user.role === "LEARNER") {
        router.push("/learning")
      } else if (user.role === "EDUCATOR") {
        router.push("/instructor/courses")
      } else if (user.role === "ADMIN") {
        router.push("/")
      }
      
      // Force refresh to update auth state
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      const message = error.response?.data?.message || "Invalid email or password"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const roleConfig = {
    student: {
      icon: <GraduationCap className="w-6 h-6" />,
      color: "blue",
      title: "Student Login",
      description: "Access your courses, assignments, and learning dashboard",
      bgGradient: "from-blue-500 to-cyan-500",
    },
    educator: {
      icon: <Users className="w-6 h-6" />,
      color: "purple",
      title: "Educator Login",
      description: "Manage courses, grade assignments, and track student progress",
      bgGradient: "from-purple-500 to-pink-500",
    },
    admin: {
      icon: <Shield className="w-6 h-6" />,
      color: "orange",
      title: "Admin Login",
      description: "Manage platform, users, departments, and system settings",
      bgGradient: "from-orange-500 to-red-500",
    },
  }

  const currentRole = roleConfig[activeRole as keyof typeof roleConfig]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
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
              Welcome Back! 👋
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Sign in to continue your learning journey at College Academy
            </p>
            
            <div className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">500+ Courses</p>
                  <p className="text-sm text-gray-500">Expert-led learning paths</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">50+ Expert Faculty</p>
                  <p className="text-sm text-gray-500">Industry professionals</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Verified Certificates</p>
                  <p className="text-sm text-gray-500">Industry-recognized credentials</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="p-8 shadow-2xl">
          {/* Role Tabs */}
          <Tabs value={activeRole} onValueChange={setActiveRole} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="student" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <GraduationCap className="w-4 h-4 mr-2" />
                Student
              </TabsTrigger>
              <TabsTrigger value="educator" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                Educator
              </TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
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

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${currentRole.bgGradient} hover:opacity-90 text-white font-semibold text-lg py-6`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link href="/sign-up" className={`font-semibold text-${currentRole.color}-600 hover:underline`}>
                Sign up here
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-blue-200 dark:border-gray-600">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="text-lg">🔐</span> Test Accounts (Password: demo123)
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">👑 Admin:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">admin@college.edu</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">👨‍🏫 Educator:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">educator@college.edu</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded">
                <span className="text-gray-600 dark:text-gray-400">👨‍🎓 Student:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">student@college.edu</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}