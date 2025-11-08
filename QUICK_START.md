# 🚀 Quick Start Guide - Tech Vision Academy

## Starting the Application

```bash
cd /home/arpitksi/Downloads/academy-master
npm run dev
```

Visit: **http://localhost:3000**

## 👤 Demo Accounts

### Educator 1
- **ID**: `educator_demo_1`
- **Email**: educator1@academy.com
- **Name**: John Doe
- **Specialization**: Web Development

### Educator 2
- **ID**: `educator_demo_2`
- **Email**: educator2@academy.com
- **Name**: Jane Smith
- **Specialization**: Data Science

### Learner (You)
- **ID**: `user_demo_123`
- **Email**: learner@academy.com
- **Name**: Demo User
- **Enrolled**: 2 courses

## 📍 Key URLs

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Browse all courses |
| Dashboard | `/dashboard` | Your learning dashboard |
| Instructor | `/instructor/courses` | Manage your courses |
| Learning | `/learning` | Your enrolled courses |
| Categories | `/categories/[id]` | Filter by category |
| Course View | `/courses/[id]/overview` | View course details |

## 🎨 New Features Available

### 1. **Learner Dashboard** (`/dashboard`)
- View your enrolled courses
- Track progress
- See certificates
- Learning statistics

### 2. **Enroll in Courses**
- Click any course card
- Click "Enroll Now" button
- Start learning immediately

### 3. **Dark Mode**
- Click the moon/sun icon in top bar
- Toggle between light/dark themes
- Preference saved automatically

### 4. **Discussion Forums**
- View Q&A for each course
- See upvotes and answers
- Participate in discussions

### 5. **Module Builder** (Educators)
- Drag and drop to reorder
- Add new modules
- Organize course content

## 📊 Database Features

All these work automatically:
- ✅ User enrollment tracking
- ✅ Progress monitoring
- ✅ Analytics updates
- ✅ Certificate generation (database ready)
- ✅ Quiz system (database ready)
- ✅ Assignment submissions (database ready)
- ✅ Discussion forums (database ready)

## 🛠️ Quick Commands

```bash
# Start development server
npm run dev

# Regenerate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Reset and reseed database
npx prisma db push --force-reset
npx ts-node scripts/seed-enhanced.ts
```

## 🎯 Test the Features

1. **Browse Courses**
   - Go to homepage
   - Click on categories
   - View different courses

2. **Enroll in a Course**
   - Click any course
   - Click "Enroll Now"
   - See it appear in Dashboard

3. **Check Your Dashboard**
   - Go to `/dashboard`
   - See your enrolled courses
   - View your statistics

4. **Toggle Dark Mode**
   - Click moon icon in header
   - Watch the theme change
   - Refresh page (theme persists)

5. **Explore Educator Tools**
   - Go to `/instructor/courses`
   - See course management
   - Access module builder

## 📁 Project Structure

```
app/
├── (home)/
│   ├── page.tsx           # Homepage
│   └── dashboard/         # ✨ NEW Dashboard
├── (instructor)/
│   └── instructor/courses # Educator dashboard
└── api/
    └── courses/
        └── [id]/enroll/   # ✨ NEW Enrollment API

components/
├── courses/
│   ├── EnrollButton.tsx   # ✨ NEW
│   └── ModuleBuilder.tsx  # ✨ NEW
├── discussions/
│   └── DiscussionForum.tsx # ✨ NEW
└── custom/
    └── DarkModeToggle.tsx  # ✨ NEW
```

## 💡 Tips

1. **Enrollments are instant** - Click enroll and refresh to see changes
2. **Dark mode persists** - Uses localStorage
3. **All data is local** - SQLite database in `prisma/dev.db`
4. **Demo user is logged in** - No need to sign in
5. **Categories work** - Click any category to filter

## 🐛 Troubleshooting

**Issue**: Prisma errors  
**Fix**: `npx prisma generate`

**Issue**: Page not loading  
**Fix**: Check `http://localhost:3000` is running

**Issue**: No courses showing  
**Fix**: Run `npx ts-node scripts/seed-enhanced.ts`

**Issue**: Dark mode not working  
**Fix**: Clear browser cache and refresh

## ✨ What's Working

- [x] Homepage with course browsing
- [x] Category filtering  
- [x] Course enrollment
- [x] Learner dashboard
- [x] Progress tracking
- [x] Dark mode toggle
- [x] Discussion forums display
- [x] Module builder interface
- [x] Educator dashboard
- [x] User authentication (demo)
- [x] Responsive design
- [x] Search functionality

## 🎊 Ready Features

Everything listed above is **fully functional** and ready to use right now!

The database supports even more features (quizzes, assignments, certificates, etc.) - the infrastructure is all in place.

Enjoy exploring your new learning platform! 🚀
