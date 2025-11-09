import { z } from "zod";

// ============= Authentication Schemas =============

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["STUDENT", "EDUCATOR", "ADMIN"]),
  departmentId: z.string().uuid().optional(),
  year: z.string().optional(),
  enrollmentId: z.string().optional(),
  designation: z.string().optional(),
  facultyId: z.string().optional(),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const passwordResetSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// ============= User Schemas =============

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  bio: z.string().max(1000).optional(),
  specialization: z.string().max(200).optional(),
  contactInfo: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
  officeHours: z.string().optional(),
  researchInterests: z.array(z.string()).optional(),
  publications: z.array(z.string()).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(["STUDENT", "EDUCATOR", "ADMIN"]),
});

// ============= Course Schemas =============

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  categoryId: z.string().uuid().optional(),
  subCategoryId: z.string().uuid().optional(),
  levelId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  imageUrl: z.string().url().optional(),
  price: z.number().min(0).optional(),
});

export const updateCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  subtitle: z.string().max(500).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  price: z.number().min(0, "Price must be non-negative").optional(),
  departmentId: z.string().optional(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  levelId: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const createSectionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  position: z.number().int().min(0).optional(),
});

export const updateSectionSchema = createSectionSchema.partial();

export const reorderSectionsSchema = z.object({
  sections: z.array(
    z.object({
      id: z.string().uuid(),
      position: z.number().int().min(0),
    })
  ),
});

export const createSectionResourceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fileUrl: z.string().min(1, "File URL is required"),
});

// ============= Assignment Schemas =============

export const createAssignmentSchema = z.object({
  courseId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().datetime().optional(),
  maxScore: z.number().int().min(0).max(100),
  fileUrl: z.string().url().optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial().omit({ courseId: true });

export const submitAssignmentSchema = z.object({
  fileUrl: z.string().url().optional(),
  submissionText: z.string().optional(),
});

export const gradeAssignmentSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().optional(),
});

// ============= Quiz Schemas =============

export const createQuizSchema = z.object({
  courseId: z.string().uuid(),
  sectionId: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  timeLimit: z.number().int().min(1).optional(), // in minutes
  passingScore: z.number().min(0).max(100),
  maxAttempts: z.number().int().min(1).optional(),
  questions: z.array(
    z.object({
      question: z.string().min(3),
      type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.string(),
      points: z.number().int().min(1),
    })
  ),
});

export const updateQuizSchema = createQuizSchema.partial().omit({ courseId: true });

export const submitQuizSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().uuid(),
      answer: z.string(),
    })
  ),
});

// ============= Discussion Schemas =============

export const createDiscussionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(["COURSE", "DEPARTMENT", "GENERAL"]),
  courseId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
});

export const updateDiscussionSchema = createDiscussionSchema.partial();

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  parentId: z.string().uuid().optional(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

// ============= Material Schemas =============

export const createMaterialSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  fileUrl: z.string().url("Invalid file URL"),
  fileName: z.string().min(1, "File name is required"),
  fileType: z.string().min(1, "File type is required"),
  fileSize: z.number().int().min(0).optional(),
  category: z
    .enum([
      "Lecture Notes",
      "Research Paper",
      "Tutorial",
      "Assignment",
      "Study Material",
      "Reference",
    ])
    .optional(),
  tags: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const updateMaterialSchema = createMaterialSchema.partial().omit({ fileUrl: true });

// ============= Enrollment Schemas =============

export const enrollCourseSchema = z.object({
  courseId: z.string().uuid(),
});

// ============= Progress Schemas =============

export const updateProgressSchema = z.object({
  sectionId: z.string().uuid(),
  isCompleted: z.boolean(),
});

// ============= Rating Schemas =============

export const createRatingSchema = z.object({
  courseId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  review: z.string().max(1000).optional(),
});

export const updateRatingSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  review: z.string().max(1000).optional(),
});

// ============= Department Schemas =============

export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters").max(10),
  description: z.string().optional(),
  headOfDepartmentId: z.string().uuid().optional(),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

// ============= Pagination & Filtering =============

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const courseFilterSchema = paginationSchema.extend({
  categoryId: z.string().uuid().optional(),
  levelId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  search: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
});

export const discussionFilterSchema = paginationSchema.extend({
  category: z.enum(["COURSE", "DEPARTMENT", "GENERAL"]).optional(),
  courseId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// ============= Type Exports =============

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type CreateSectionResourceInput = z.infer<typeof createSectionResourceSchema>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type SubmitAssignmentInput = z.infer<typeof submitAssignmentSchema>;
export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type CreateMaterialInput = z.infer<typeof createMaterialSchema>;
export type CourseFilterInput = z.infer<typeof courseFilterSchema>;
