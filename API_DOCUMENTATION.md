# VNIT E-Learning Platform - Complete API Documentation

## 🔐 Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Auth Endpoints

#### POST /api/auth/signup
Register a new user account.
- **Body**: `{ email, password, firstName, lastName, role, departmentId }`
- **Response**: `{ user, accessToken, refreshToken }`
- **Rate Limit**: 5 requests/minute

#### POST /api/auth/signin
Login and get JWT tokens.
- **Body**: `{ email, password }`
- **Response**: `{ user, accessToken, refreshToken }`
- **Rate Limit**: 5 requests/minute

#### POST /api/auth/refresh
Refresh access token using refresh token.
- **Body**: `{ refreshToken }`
- **Response**: `{ accessToken, refreshToken }`

#### GET /api/auth/me
Get current authenticated user.
- **Auth**: Required
- **Response**: `{ user }`

---

## 👤 User Management

#### GET /api/users/profile
Get user profile with relations.
- **Auth**: Required
- **Response**: `{ user }` (includes department, courses, enrollments)

#### PATCH /api/users/profile
Update user profile.
- **Auth**: Required
- **Body**: `{ firstName, lastName, bio, specialization, etc. }`
- **Response**: `{ user }`

---

## 📚 Course Management

#### GET /api/courses
List courses with filtering and pagination.
- **Query Params**:
  - `category` - Filter by category ID
  - `level` - Filter by level ID
  - `department` - Filter by department ID
  - `search` - Search in title/description
  - `published` - Filter by publish status
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `sortBy` - Sort field (title, createdAt, price)
  - `sortOrder` - asc or desc
- **Response**: `{ data: [courses], pagination }`

#### POST /api/courses
Create a new course (educators/admins only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ title, subtitle, description, categoryId, levelId, departmentId, price, imageUrl }`
- **Response**: `{ course }` (201 Created)

#### GET /api/courses/[courseId]
Get single course with full details.
- **Auth**: Optional (affects visibility)
- **Response**: `{ course }` (includes sections, instructor, ratings, enrollments)

#### PATCH /api/courses/[courseId]
Update a course (owner/admin only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: Partial course data
- **Response**: `{ course }`

#### DELETE /api/courses/[courseId]
Delete a course (owner/admin only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Response**: `{ message }`
- **Note**: Deletes all Mux video assets

#### POST /api/courses/[courseId]/publish
Publish a course.
- **Auth**: Required (EDUCATOR/ADMIN)
- **Validation**: Requires title, description, image, and at least one published section
- **Response**: `{ course }`

#### POST /api/courses/[courseId]/unpublish
Unpublish a course.
- **Auth**: Required (EDUCATOR/ADMIN)
- **Response**: `{ course }`

---

## 📖 Section Management

#### POST /api/courses/[courseId]/sections
Create a new section in a course.
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ title, description, videoUrl, isFree }`
- **Response**: `{ section }` (201 Created)
- **Note**: Position is auto-calculated

#### GET /api/courses/[courseId]/sections/[sectionId]
Get section details.
- **Auth**: Optional
- **Response**: `{ section }` (includes resources, muxData)

#### PATCH /api/courses/[courseId]/sections/[sectionId]
Update a section.
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ title, description, videoUrl, isFree, isPublished }`
- **Response**: `{ section }`
- **Note**: Handles Mux video upload/deletion

#### DELETE /api/courses/[courseId]/sections/[sectionId]
Delete a section.
- **Auth**: Required (EDUCATOR/ADMIN)
- **Response**: `{ message }`
- **Note**: Auto-unpublishes course if no sections remain

---

## 🎓 Enrollment & Progress

#### POST /api/courses/[courseId]/enroll
Enroll in a course.
- **Auth**: Required
- **Response**: `{ enrollment }` (201 Created)
- **Note**: Updates course analytics

#### GET /api/enrollments
Get user's enrollments.
- **Auth**: Required
- **Query Params**:
  - `status` - 'active' or 'completed'
  - `page`, `limit` - Pagination
- **Response**: `{ enrollments, pagination }`

#### POST /api/progress/[sectionId]
Mark a section as complete/incomplete (toggle).
- **Auth**: Required (STUDENT)
- **Response**: `{ completed, courseProgress }`
- **Note**: Auto-updates enrollment progress percentage

---

## 📝 Assignment System

#### POST /api/assignments
Create an assignment (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ title, description, instructions, sectionId, dueDate, maxScore, attachments }`
- **Response**: `{ assignment }` (201 Created)

#### GET /api/assignments
List assignments (filtered by access).
- **Auth**: Required
- **Query Params**: `courseId`, `sectionId`, `page`, `limit`
- **Response**: `{ data: [assignments], pagination }`
- **Note**: Students see only enrolled courses

#### GET /api/assignments/[assignmentId]
Get assignment details with submissions.
- **Auth**: Required
- **Response**: `{ assignment }` (includes submissions based on role)

#### PATCH /api/assignments/[assignmentId]
Update assignment (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: Partial assignment data
- **Response**: `{ assignment }`

#### DELETE /api/assignments/[assignmentId]
Delete assignment (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Response**: `{ message }`

#### POST /api/assignments/[assignmentId]/submit
Submit an assignment (students only).
- **Auth**: Required (STUDENT/LEARNER)
- **Body**: `{ submissionText, fileUrl }`
- **Response**: `{ submission }`
- **Note**: Can resubmit before due date

#### PATCH /api/assignments/[assignmentId]/submissions/[submissionId]/grade
Grade a submission (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ score, feedback }`
- **Response**: `{ submission }`
- **Validation**: Score cannot exceed maxScore

---

## 🧠 Quiz System

#### POST /api/quizzes
Create a quiz (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: `{ title, description, sectionId, passingScore, timeLimit, questions, maxAttempts }`
- **Response**: `{ quiz }` (201 Created)

#### GET /api/quizzes
List quizzes (filtered by access).
- **Auth**: Required
- **Query Params**: `sectionId`, `courseId`, `page`, `limit`
- **Response**: `{ data: [quizzes], pagination }`

#### GET /api/quizzes/[quizId]
Get quiz details.
- **Auth**: Required
- **Response**: `{ quiz }`
- **Note**: Questions hidden for students until attempt starts

#### PATCH /api/quizzes/[quizId]
Update quiz (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Body**: Partial quiz data
- **Response**: `{ quiz }`

#### DELETE /api/quizzes/[quizId]
Delete quiz (educators only).
- **Auth**: Required (EDUCATOR/ADMIN)
- **Response**: `{ message }`

#### POST /api/quizzes/[quizId]/attempt
Start a quiz attempt (students only).
- **Auth**: Required (STUDENT/LEARNER)
- **Response**: `{ attempt }` (201 Created)
- **Validation**: Checks max attempts and ongoing attempts

#### POST /api/quizzes/[quizId]/submit
Submit quiz answers and get results.
- **Auth**: Required (STUDENT/LEARNER)
- **Body**: `{ answers: { [questionId]: answer } }`
- **Response**: `{ attempt, results, summary }`
- **Note**: Auto-grades and calculates percentage

---

## 💬 Discussion Forum

#### POST /api/discussions
Create a discussion thread.
- **Auth**: Required
- **Body**: `{ title, content, courseId, departmentId, tags }`
- **Response**: `{ discussion }` (201 Created)

#### GET /api/discussions
List discussions with filters.
- **Auth**: Required
- **Query Params**:
  - `courseId` - Filter by course
  - `departmentId` - Filter by department
  - `search` - Search in title/content
  - `tag` - Filter by tag
  - `status` - 'open', 'closed', 'resolved'
  - `page`, `limit` - Pagination
- **Response**: `{ data: [discussions], pagination }`
- **Note**: Pinned discussions appear first

#### GET /api/discussions/[discussionId]
Get discussion with all comments.
- **Auth**: Required
- **Response**: `{ discussion }` (includes comments, votes, author)
- **Note**: Increments view count

#### PATCH /api/discussions/[discussionId]
Update discussion.
- **Auth**: Required (author/educator/admin)
- **Body**: `{ title, content, tags, status, isPinned }`
- **Response**: `{ discussion }`
- **Note**: Only educators/admins can change status and pin

#### DELETE /api/discussions/[discussionId]
Delete discussion.
- **Auth**: Required (author/admin)
- **Response**: `{ message }`

#### POST /api/discussions/[discussionId]/comments
Add a comment to a discussion.
- **Auth**: Required
- **Body**: `{ content }`
- **Response**: `{ comment }` (201 Created)

#### POST /api/comments/[commentId]/vote
Vote on a comment.
- **Auth**: Required
- **Body**: `{ value: 1 | -1 | 0 }` (1=upvote, -1=downvote, 0=remove)
- **Response**: `{ message, upvotes, downvotes, score }`

---

## 🔒 Security Features

### Rate Limiting
- **Strict**: 5 requests/minute (auth endpoints)
- **Moderate**: 20 requests/minute (most endpoints)
- **Relaxed**: 100 requests/minute (read operations)

### Authentication
- **Access Token**: JWT, expires in 15 minutes
- **Refresh Token**: JWT, expires in 7 days
- **Password Hashing**: bcrypt with salt rounds 12

### Authorization
- **Role-Based Access Control (RBAC)**
  - ADMIN: Full access
  - EDUCATOR: Can create/manage courses, assignments, quizzes
  - STUDENT/LEARNER: Can enroll, submit, participate
- **Ownership Checks**: Users can only modify their own content
- **Enrollment Verification**: Students must be enrolled to access course content

### Validation
- **All inputs validated** with Zod schemas
- **Type-safe** request/response handling
- **SQL injection protection** via Prisma ORM

### Error Handling
- **Consistent error responses** with appropriate HTTP codes
- **Custom error classes**: UnauthorizedError, ForbiddenError, NotFoundError, BadRequestError, ConflictError, ValidationError
- **Error logging** for debugging

---

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🚀 System Features

✅ **Complete Authentication System** - JWT with access/refresh tokens
✅ **User Management** - Profiles, roles, departments
✅ **Course Management** - Full CRUD with publish workflow
✅ **Section Management** - Video uploads with Mux integration
✅ **Enrollment System** - Track enrollments and progress
✅ **Assignment System** - Create, submit, grade assignments
✅ **Quiz System** - Auto-graded quizzes with time limits
✅ **Discussion Forum** - Threads, comments, voting
✅ **Progress Tracking** - Real-time course completion tracking
✅ **Role-Based Access** - ADMIN, EDUCATOR, STUDENT permissions
✅ **Rate Limiting** - Prevent abuse and DDoS
✅ **Input Validation** - Comprehensive Zod schemas
✅ **Error Handling** - Consistent error responses
✅ **Pagination** - All list endpoints support pagination
✅ **Search & Filtering** - Advanced query capabilities
✅ **Video Management** - Mux integration for video hosting

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.3 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Video**: Mux
- **Rate Limiting**: rate-limiter-flexible
- **File Upload**: UploadThing

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- File uploads use UploadThing for materials
- Video uploads use Mux for course content
- Course analytics are automatically updated on enrollments
- Progress is automatically calculated on section completion
- Quiz scores are automatically graded on submission
- Discussion views are automatically incremented

This is a **production-ready, enterprise-grade** E-Learning Management System with comprehensive features and robust security! 🎉
