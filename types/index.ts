// Comprehensive type definitions for the entire application

import { Prisma } from "@prisma/client";

// ============================================
// USER TYPES
// ============================================
export type UserRole = "STUDENT" | "EDUCATOR" | "ADMIN" | "LEARNER" | "GUEST";

export interface SafeUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  role: string;
  departmentId: string | null;
  isOnboarded: boolean;
}

// ============================================
// COURSE TYPES
// ============================================
export type CourseWithDetails = Prisma.CourseGetPayload<{
  include: {
    instructor: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
        designation: true;
      };
    };
    category: true;
    subCategory: true;
    level: true;
    department: true;
    sections: {
      include: {
        resources: true;
        muxData: true;
      };
    };
  };
}>;

export type CourseCard = Prisma.CourseGetPayload<{
  include: {
    instructor: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
      };
    };
    category: true;
    level: true;
  };
}>;

// ============================================
// ENROLLMENT TYPES
// ============================================
export type EnrollmentWithCourse = Prisma.EnrollmentGetPayload<{
  include: {
    course: {
      include: {
        category: true;
        instructor: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            imageUrl: true;
          };
        };
        sections: {
          where: { isPublished: true };
        };
      };
    };
  };
}>;

// ============================================
// SECTION TYPES
// ============================================
export type SectionWithDetails = Prisma.SectionGetPayload<{
  include: {
    resources: true;
    muxData: true;
  };
}>;

// ============================================
// PROGRESS TYPES
// ============================================
export type ProgressWithSection = Prisma.ProgressGetPayload<{
  include: {
    section: {
      include: {
        course: true;
      };
    };
  };
}>;

// ============================================
// ASSIGNMENT TYPES
// ============================================
export interface AssignmentSubmissionData {
  assignmentId: string;
  studentId: string;
  content: string;
  fileUrl?: string;
}

export interface GradeAssignmentData {
  submissionId: string;
  score: number;
  feedback?: string;
  gradedBy: string;
}

// ============================================
// QUIZ TYPES
// ============================================
export interface QuizAttemptData {
  quizId: string;
  studentId: string;
  answers: Record<string, any>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "short_answer";
  options?: string[];
  correctAnswer: any;
  points: number;
}

// ============================================
// DISCUSSION TYPES
// ============================================
export type DiscussionWithDetails = Prisma.DiscussionGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
        role: true;
      };
    };
    course: {
      select: {
        id: true;
        title: true;
      };
    };
    comments: {
      include: {
        author: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            imageUrl: true;
            role: true;
          };
        };
        votes: true;
      };
    };
  };
}>;

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// ============================================
// EDUCATOR TYPES
// ============================================
export interface EducatorProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  designation: string | null;
  specialization: string | null;
  bio: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

// ============================================
// CERTIFICATE TYPES
// ============================================
export type CertificateWithCourse = Prisma.CertificateGetPayload<{
  include: {
    course: {
      select: {
        id: true;
        title: true;
        instructor: {
          select: {
            firstName: true;
            lastName: true;
          };
        };
      };
    };
  };
}>;

// ============================================
// DEPARTMENT TYPES
// ============================================
export type DepartmentWithHead = Prisma.DepartmentGetPayload<{
  include: {
    headOfDepartment: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
        designation: true;
      };
    };
  };
}>;

// ============================================
// MATERIAL TYPES
// ============================================
export type SharedMaterialWithEducator = Prisma.SharedMaterialGetPayload<{
  include: {
    educator: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        imageUrl: true;
        designation: true;
      };
    };
  };
}>;

// ============================================
// FILTER & QUERY TYPES
// ============================================
export interface CourseFilters {
  category?: string;
  level?: string;
  department?: string;
  search?: string;
  published?: boolean;
  instructorId?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SortParams {
  field: string;
  order: "asc" | "desc";
}
