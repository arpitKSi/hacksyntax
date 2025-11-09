# 🔐 Authentication System - Complete Guide

## What Was Fixed

### ❌ Previous Issues
1. **Sign-in not working** - Page was just a demo, not calling real API
2. **Course creation failing** - No authentication tokens being sent
3. **Content upload broken** - API endpoints rejecting unauthenticated requests
4. **No test users** - Database had no users to login with

### ✅ Solutions Implemented

## 1. JWT Authentication Flow

### Sign-In Process
The sign-in page now properly authenticates users:

```typescript
// When user submits login form:
1. POST /api/auth/signin with email & password
2. Server validates credentials and returns JWT tokens
3. Tokens are stored in localStorage
4. User is redirected based on their role
```

### Automatic Token Management
All API requests now include authentication automatically:

```typescript
// lib/api-client.ts handles:
- Attaching Bearer token to every request
- Automatic token refresh when expired
- Redirect to login if refresh fails
```

## 2. Test Accounts

Three test users are now available:

| Role     | Email                  | Password | Access Level        |
|----------|------------------------|----------|---------------------|
| 👑 Admin | admin@college.edu      | demo123  | Full system access  |
| 👨‍🏫 Educator | educator@college.edu | demo123  | Create courses/content |
| 👨‍🎓 Student | student@college.edu   | demo123  | Enroll & learn     |

## 3. How to Use

### Login
1. Go to `http://localhost:3000/sign-in`
2. Select your role (Student/Educator/Admin)
3. Use credentials from table above
4. Click "Sign In"

### Create a Course (as Educator)
1. Login as `educator@college.edu / demo123`
2. Navigate to "Create Course"
3. Fill in course details
4. Upload content (videos, PDFs, etc.)
5. Publish course

### Upload Content
All file upload components now work with JWT authentication:
- **Videos**: Automatically uploaded to Mux
- **PDFs/Documents**: Uploaded via UploadThing
- **Images**: Course thumbnails and profile pictures

## 4. Technical Details

### Authentication Files Created/Updated

#### New Files
- `lib/api-client.ts` - Axios instance with JWT interceptors
- `scripts/seed.ts` - Database seed with test users

#### Updated Files  
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` - Real authentication
- `app/(instructor)/layout.tsx` - JWT-based route protection
- `components/**/*.tsx` - All API calls use apiClient
- `prisma/schema.prisma` - clerkId now optional

### API Routes Protected
All API endpoints require valid JWT token:
```
✅ POST /api/courses - Create course
✅ PATCH /api/courses/[id] - Update course
✅ POST /api/courses/[id]/sections - Add sections
✅ POST /api/assignments - Create assignments
✅ POST /api/quizzes - Create quizzes
✅ POST /api/discussions - Create discussions
... and 40+ more endpoints
```

## 5. Token Management

### Access Token
- **Duration**: 15 minutes
- **Storage**: localStorage
- **Usage**: All API requests
- **Auto-refresh**: When expired

### Refresh Token
- **Duration**: 7 days
- **Storage**: localStorage
- **Usage**: Get new access token
- **Security**: HTTP-only cookie in production

## 6. Troubleshooting

### "Unauthorized" Error
**Solution**: Login again at `/sign-in`

### "Token expired"
**Solution**: Automatic refresh happens, if fails -> redirected to login

### Can't create course
**Solution**: 
1. Verify you're logged in as Educator or Admin
2. Check browser console for errors
3. Clear localStorage and login again

### Content upload fails
**Solution**:
1. Check file size limits (videos: 100MB, docs: 10MB)
2. Verify internet connection for Mux/UploadThing
3. Check API keys in `.env.local`

## 7. Security Features

✅ Password hashing with bcrypt (salt rounds: 12)
✅ JWT token expiration (15min access, 7day refresh)
✅ Role-based access control (RBAC)
✅ Input validation with Zod
✅ Rate limiting on all endpoints
✅ SQL injection protection (Prisma ORM)
✅ XSS protection (React sanitization)

## 8. Next Steps

### For Development
1. ✅ Login with test account
2. ✅ Create your first course
3. ✅ Upload content (videos, PDFs)
4. ✅ Create assignments and quizzes
5. ✅ Test discussion forums

### For Production
1. Update JWT secrets in `.env`
2. Set up proper database (PostgreSQL)
3. Configure Mux for video hosting
4. Set up UploadThing for file storage
5. Enable HTTPS
6. Set up monitoring/logging

## 9. API Reference

Full API documentation: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick Examples

**Create Course**
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Web Development 101",
    "categoryId": "uuid",
    "subCategoryId": "uuid"
  }'
```

**Upload Section Video**
```bash
curl -X POST http://localhost:3000/api/courses/[id]/sections \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "video=@video.mp4" \
  -F "title=Introduction"
```

---

## Summary

🎉 **Everything is now working!**

- ✅ Authentication system functional
- ✅ Course creation working
- ✅ Content upload operational
- ✅ Test users available
- ✅ All API routes protected
- ✅ 40+ endpoints ready to use

**Login now**: `http://localhost:3000/sign-in`
