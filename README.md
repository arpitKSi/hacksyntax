# 🎓 VNIT E-Learning Platform

A comprehensive, production-ready Learning Management System (LMS) built with Next.js 14, featuring advanced course management, real-time progress tracking, assignments, quizzes, and discussion forums.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Setup database and create test users
npx prisma db push
node scripts/seed.ts

# Run development server
npm run dev
```

Visit `http://localhost:3000/sign-in`

## 🔐 Test Accounts

| Role     | Email                  | Password |
|----------|------------------------|----------|
| 👑 Admin | admin@college.edu      | demo123  |
| 👨‍🏫 Educator | educator@college.edu | demo123  |
| 👨‍🎓 Student | student@college.edu   | demo123  |

## ✨ Complete Feature List

✅ JWT Authentication with Access/Refresh Tokens  
✅ Role-Based Access Control (ADMIN, EDUCATOR, STUDENT)  
✅ Complete Course Management (CRUD + Publish Workflow)  
✅ Section Management with Mux Video Integration  
✅ Enrollment System with Progress Tracking  
✅ Assignment System (Create, Submit, Grade)  
✅ Quiz System with Auto-Grading & Time Limits  
✅ Discussion Forum with Comments & Voting  
✅ File Upload (Videos via Mux, Documents via UploadThing)  
✅ Rate Limiting & Security  
✅ Input Validation with Zod  
✅ Comprehensive Error Handling  
✅ Pagination & Search  

## 📚 Documentation

- **[Authentication Guide](./AUTHENTICATION_GUIDE.md)** - How to use the system
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with 40+ endpoints

## �️ Tech Stack

- **Frontend**: Next.js 14.2.3 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, JWT Authentication
- **Database**: SQLite + Prisma ORM (19 models)
- **Video**: Mux for video processing and streaming
- **File Upload**: UploadThing
- **Validation**: Zod schemas
- **Security**: bcrypt password hashing, rate limiting, RBAC

## 🚀 Usage Guide

### 1. Login
- Navigate to `/sign-in`
- Use credentials from table above
- System auto-redirects based on role

### 2. Create a Course (Educator/Admin)
- Click "Create Course"
- Fill in title, category, subcategory
- Upload course thumbnail
- Add sections with videos/documents
- Create assignments and quizzes
- Publish when ready

### 3. Upload Content
- **Videos**: Drag & drop or click to upload (auto-processed by Mux)
- **Documents**: PDF, DOC, PPT supported
- **Images**: Course thumbnails, profile pictures

### 4. Manage Students (Educator)
- View enrollments
- Grade assignments
- Track progress
- Respond to discussions

## 📖 Key Features Explained

### Authentication
- **Access Token**: 15min (auto-refreshes)
- **Refresh Token**: 7 days
- **Storage**: localStorage (secure HTTP-only in production)
- **Auto-redirect**: On token expiration

### Course Creation
1. Basic info (title, category, price)
2. Add sections with content
3. Create assignments with deadlines
4. Build quizzes with auto-grading
5. Set prerequisites
6. Publish

### Content Upload
- Supports: MP4, PDF, DOC, PPT, JPG, PNG
- Max size: Videos 100MB, Documents 10MB
- Auto-processing for videos (Mux)
- CDN delivery for all files

## � Security Features

- Password hashing (bcrypt, salt rounds: 12)
- JWT token-based authentication
- Role-based access control
- Rate limiting (5-100 req/min based on endpoint)
- Input validation on all routes
- SQL injection protection (Prisma)
- XSS protection (React)

## 📝 API Endpoints

**Authentication** (4 endpoints)
- POST /api/auth/signin
- POST /api/auth/signup
- POST /api/auth/refresh
- GET /api/auth/me

**Courses** (8 endpoints)
**Sections** (4 endpoints)
**Assignments** (7 endpoints)
**Quizzes** (6 endpoints)
**Discussions** (6 endpoints)

... and 15+ more categories

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference

## 🐛 Troubleshooting

**"Unauthorized" error**
→ Login again at `/sign-in`

**Can't create course**
→ Verify you're logged in as Educator/Admin

**Upload fails**
→ Check file size limits and internet connection

**Token expired**
→ Auto-refresh handles this, or clear localStorage

## Built with ❤️ for VNIT
