"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  UserCircle2,
  Mail,
  Building2,
  GraduationCap,
  BookOpen,
  Star,
  Award,
  Briefcase,
  Clock,
  TrendingUp,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { extractApiData, authHelpers } from "@/lib/api-client";

export interface ProfileCourseSummary {
  id: string;
  title: string;
  imageUrl: string | null;
  createdAt: string;
  isPublished: boolean;
}

export interface ProfileEnrollmentSummary {
  id: string;
  enrolledAt: string;
  progress: number;
  isCompleted: boolean;
  course: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
}

export interface ProfileData {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  department: { id: string; name: string; code: string } | null;
  designation: string | null;
  facultyId: string | null;
  specialization: string | null;
  bio: string | null;
  contactInfo: string | null;
  officeHours: string | null;
  enrollmentId: string | null;
  year: string | null;
  researchInterests: string[];
  publications: string[];
  rating: number | null;
  totalRatings: number;
  coursesCreated: ProfileCourseSummary[];
  enrollments: ProfileEnrollmentSummary[];
}

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  bio: string;
  specialization: string;
  contactInfo: string;
  officeHours: string;
  enrollmentId: string;
  year: string;
  researchInterests: string;
  publications: string;
};

const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name should be at least 2 characters")
    .max(50, "First name is too long")
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(2, "Last name should be at least 2 characters")
    .max(50, "Last name is too long")
    .optional()
    .or(z.literal("")),
  bio: z.string().max(1000, "Bio must be 1000 characters or fewer").optional().or(z.literal("")),
  specialization: z
    .string()
    .max(200, "Specialization must be 200 characters or fewer")
    .optional()
    .or(z.literal("")),
  contactInfo: z
    .string()
    .max(200, "Contact info must be 200 characters or fewer")
    .optional()
    .or(z.literal("")),
  officeHours: z.string().optional().or(z.literal("")),
  enrollmentId: z.string().optional().or(z.literal("")),
  year: z.string().optional().or(z.literal("")),
  researchInterests: z.string().optional().or(z.literal("")),
  publications: z.string().optional().or(z.literal("")),
});

function sanitize(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : undefined;
}

const YEAR_OPTIONS = ["1", "2", "3", "4", "5"];

const ProfileDashboard = ({ profile }: { profile: ProfileData }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fullName = useMemo(() => {
    const name = `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim();
    if (name.length > 0) return name;
    return profile.email.split("@")[0];
  }, [profile.firstName, profile.lastName, profile.email]);

  const roleLabel = useMemo(() => {
    switch (profile.role) {
      case "ADMIN":
        return "Administrator";
      case "EDUCATOR":
        return "Educator";
      case "LEARNER":
      case "STUDENT":
        return "Student";
      default:
        return profile.role;
    }
  }, [profile.role]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      bio: profile.bio ?? "",
      specialization: profile.specialization ?? "",
      contactInfo: profile.contactInfo ?? "",
      officeHours: profile.officeHours ?? "",
      enrollmentId: profile.enrollmentId ?? "",
      year: profile.year ?? "",
      researchInterests: profile.researchInterests.join(", "),
      publications: profile.publications.join("\n"),
    },
  });

  const isEducator = profile.role === "EDUCATOR" || profile.role === "ADMIN";
  const isLearner = profile.role === "LEARNER" || profile.role === "STUDENT";

  const stats = useMemo(
    () => [
      {
        label: "Enrolled Courses",
        value: profile.enrollments.length,
        icon: GraduationCap,
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      },
      {
        label: "Courses Created",
        value: profile.coursesCreated.length,
        icon: BookOpen,
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      },
      {
        label: "Average Rating",
        value:
          profile.rating && profile.rating > 0
            ? profile.rating.toFixed(1)
            : "—",
        icon: Star,
        color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      },
      {
        label: "Research Topics",
        value: profile.researchInterests.length,
        icon: Award,
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      },
    ],
    [profile.enrollments.length, profile.coursesCreated.length, profile.rating, profile.researchInterests.length]
  );

  const handleSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);

    const researchInterests = values.researchInterests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    const publications = values.publications
      .split("\n")
      .map((pub) => pub.trim())
      .filter(Boolean);

    const payload: Record<string, unknown> = {
      firstName: sanitize(values.firstName),
      lastName: sanitize(values.lastName),
      bio: sanitize(values.bio),
      specialization: sanitize(values.specialization),
      contactInfo: sanitize(values.contactInfo),
      officeHours: sanitize(values.officeHours),
      enrollmentId: sanitize(values.enrollmentId),
      year: sanitize(values.year),
      researchInterests,
      publications,
    };

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.error?.message ||
          errorPayload?.message ||
          "Failed to update profile";
        throw new Error(message);
      }

      const rawData = await response.json();
      const data = extractApiData(rawData) as {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: string;
        imageUrl: string | null;
        department?: { id: string; name: string; code: string } | null;
      };

      const existingUser = authHelpers.getUser();
      authHelpers.setUser({
        ...(existingUser ?? {}),
        id: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        imageUrl: data.imageUrl,
        departmentId: data.department?.id ?? existingUser?.departmentId ?? null,
      });

      toast.success("Profile updated successfully");
      setIsEditOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Profile update failed", error);
      toast.error(error.message || "Unable to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FDAB04] via-[#FD8A04] to-[#FD6A04] opacity-90" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <div className="relative h-36 w-36 md:h-40 md:w-40">
                <Image
                  src={profile.imageUrl || "/avatar_placeholder.jpg"}
                  alt={fullName}
                  fill
                  className="rounded-3xl border-4 border-white/80 shadow-xl object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">
                  {fullName}
                </h1>
                <Badge className="bg-white/90 text-[#FD6A04] text-sm px-3 py-1">
                  {roleLabel}
                </Badge>
                {profile.department && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-sm">
                    {profile.department.name}
                  </Badge>
                )}
              </div>
              <p className="mt-3 flex items-center gap-2 text-white/90">
                <Mail className="h-4 w-4" />
                {profile.email}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-white/90">
                {isEducator && profile.designation && (
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    {profile.designation}
                  </span>
                )}
                {isEducator && profile.facultyId && (
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Faculty ID: {profile.facultyId}
                  </span>
                )}
                {isLearner && profile.year && (
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Year {profile.year}
                  </span>
                )}
                {profile.officeHours && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {profile.officeHours}
                  </span>
                )}
              </div>
              {profile.bio && (
                <p className="mt-4 max-w-3xl text-base text-white/90 leading-relaxed">
                  {profile.bio}
                </p>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className="font-semibold text-[#FD6A04]"
                  onClick={() => setIsEditOpen(true)}
                >
                  Edit Profile
                </Button>
                {isEducator && (
                  <Link href={`/educators/${profile.id}`}>
                    <Button variant="outline" className="border-white/70 text-white">
                      View Public Educator Page
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="shadow-sm">
                <CardContent className="flex items-center gap-4 py-5">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5" />
                Personal Details
              </CardTitle>
              <CardDescription>Key information tied to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
              {profile.contactInfo && (
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{profile.contactInfo}</p>
                </div>
              )}
              {profile.department && (
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">
                    {profile.department.name} ({profile.department.code})
                  </p>
                </div>
              )}
              {isLearner && profile.enrollmentId && (
                <div>
                  <p className="text-muted-foreground">Enrollment ID</p>
                  <p className="font-medium">{profile.enrollmentId}</p>
                </div>
              )}
              {profile.specialization && (
                <div>
                  <p className="text-muted-foreground">Specialization</p>
                  <p className="font-medium">{profile.specialization}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {isEducator && (
            <Card className="border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Teaching Insights
                </CardTitle>
                <CardDescription>Your educator footprint across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Published Courses</span>
                  <span className="font-semibold">{profile.coursesCreated.filter((c) => c.isPublished).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Draft Courses</span>
                  <span className="font-semibold">{profile.coursesCreated.filter((c) => !c.isPublished).length}</span>
                </div>
                {profile.rating && profile.rating > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Rating</span>
                    <span className="font-semibold">{profile.rating.toFixed(1)} ({profile.totalRatings} reviews)</span>
                  </div>
                )}
                {profile.researchInterests.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Research Interests</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.researchInterests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.publications.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Recent Publications</span>
                    <ul className="mt-2 space-y-2 text-sm">
                      {profile.publications.map((pub, index) => (
                        <li key={`${pub}-${index}`} className="leading-relaxed">
                          • {pub}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {isLearner && (
            <Card className="border border-gray-100 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Academic Journey
                </CardTitle>
                <CardDescription>Monitor your learning goals and milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Courses</span>
                  <span className="font-semibold">
                    {profile.enrollments.filter((enrollment) => !enrollment.isCompleted).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed Courses</span>
                  <span className="font-semibold">
                    {profile.enrollments.filter((enrollment) => enrollment.isCompleted).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Study Year</span>
                  <span className="font-semibold">{profile.year ?? "Not specified"}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {profile.enrollments.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">My Learning</h2>
              <Link href="/learning" className="text-sm text-[#FD6A04] hover:underline">
                Go to Learning
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.enrollments.map((enrollment) => (
                <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex gap-4 py-5">
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={enrollment.course.imageUrl || "/image_placeholder.webp"}
                        alt={enrollment.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/courses/${enrollment.course.id}/overview`} className="font-semibold hover:text-[#FD6A04]">
                        {enrollment.course.title}
                      </Link>
                      <div className="mt-2">
                        <Progress value={Math.min(100, Math.max(0, enrollment.progress))} className="h-2" />
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <span>{Math.round(enrollment.progress)}% complete</span>
                          {enrollment.isCompleted && <span className="text-emerald-600">Completed</span>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {isEducator && profile.coursesCreated.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Courses You Manage</h2>
              <Link href="/instructor/courses" className="text-sm text-[#FD6A04] hover:underline">
                Manage Courses
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.coursesCreated.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="flex gap-4 py-5">
                    <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={course.imageUrl || "/image_placeholder.webp"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <Link href={`/instructor/courses/${course.id}/basic`} className="font-semibold hover:text-[#FD6A04]">
                        {course.title}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(course.createdAt).toLocaleDateString()} · {course.isPublished ? "Published" : "Draft"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Keep your profile information current so learners and educators know how to reach you.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="Brief overview of your background, expertise, or academic goals"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Artificial Intelligence" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Details</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +91 00000 00000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="officeHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon-Wed 2:00 PM - 4:00 PM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enrollmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrollment ID</FormLabel>
                      <FormControl>
                        <Input placeholder="2024CS001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <FormControl>
                      <Input
                        list="year-options"
                        placeholder="Enter year (1-5)"
                        {...field}
                      />
                    </FormControl>
                    <datalist id="year-options">
                      {YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="researchInterests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="Comma separated, e.g., Data Mining, Deep Learning" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publications</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="List publications or achievements (one per line)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDashboard;
