import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎓 Seeding College LMS Database...\n");

  // Clear existing data
  await prisma.courseRating.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.courseAnalytics.deleteMany();
  await prisma.section.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.level.deleteMany();

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: "Computer Science & Engineering",
        code: "CSE",
        description: "Study of computation, algorithms, and information systems",
      },
    }),
    prisma.department.create({
      data: {
        name: "Electrical Engineering",
        code: "EE",
        description: "Study of electricity, electronics, and electromagnetism",
      },
    }),
    prisma.department.create({
      data: {
        name: "Mechanical Engineering",
        code: "ME",
        description: "Study of mechanics, kinematics, and thermodynamics",
      },
    }),
    prisma.department.create({
      data: {
        name: "Civil Engineering",
        code: "CE",
        description: "Study of construction, infrastructure, and structural design",
      },
    }),
    prisma.department.create({
      data: {
        name: "Electronics & Communication",
        code: "ECE",
        description: "Study of electronic devices and communication systems",
      },
    }),
    prisma.department.create({
      data: {
        name: "Management Studies",
        code: "MBA",
        description: "Study of business administration and management principles",
      },
    }),
  ]);

  console.log(`✅ Created ${departments.length} departments`);

  // Create Categories and SubCategories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Engineering & Technology",
        subCategories: {
          create: [
            { name: "Computer Science" },
            { name: "Electronics" },
            { name: "Mechanical Systems" },
            { name: "Civil Engineering" },
          ],
        },
      },
      include: { subCategories: true },
    }),
    prisma.category.create({
      data: {
        name: "Science & Mathematics",
        subCategories: {
          create: [
            { name: "Physics" },
            { name: "Chemistry" },
            { name: "Mathematics" },
            { name: "Biology" },
          ],
        },
      },
      include: { subCategories: true },
    }),
    prisma.category.create({
      data: {
        name: "Business & Management",
        subCategories: {
          create: [
            { name: "Business Administration" },
            { name: "Marketing" },
            { name: "Finance" },
            { name: "Operations Management" },
          ],
        },
      },
      include: { subCategories: true },
    }),
    prisma.category.create({
      data: {
        name: "Humanities & Social Sciences",
        subCategories: {
          create: [
            { name: "Psychology" },
            { name: "Sociology" },
            { name: "Economics" },
            { name: "History" },
          ],
        },
      },
      include: { subCategories: true },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create Levels
  const levels = await Promise.all([
    prisma.level.create({ data: { name: "Beginner" } }),
    prisma.level.create({ data: { name: "Intermediate" } }),
    prisma.level.create({ data: { name: "Advanced" } }),
    prisma.level.create({ data: { name: "Expert" } }),
  ]);

  console.log(`✅ Created ${levels.length} difficulty levels`);

  // Create Users
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      clerkId: "user_admin_001",
      email: "admin@college.edu",
      firstName: "System",
      lastName: "Administrator",
      role: "ADMIN",
      isOnboarded: true,
    },
  });

  // Educators
  const educator1 = await prisma.user.create({
    data: {
      clerkId: "user_educator_001",
      email: "dr.smith@college.edu",
      firstName: "Dr. John",
      lastName: "Smith",
      role: "EDUCATOR",
      departmentId: departments[0].id, // CSE
      designation: "Professor",
      facultyId: "FAC001",
      bio: "Professor of Computer Science with 20+ years of experience in AI and Machine Learning",
      specialization: "Artificial Intelligence, Machine Learning, Data Science",
      researchInterests: JSON.stringify(["Machine Learning", "Deep Learning", "Natural Language Processing"]),
      publications: JSON.stringify([
        "Advanced Machine Learning Techniques (2023)",
        "Deep Learning for Computer Vision (2022)",
      ]),
      officeHours: "Monday 2-4 PM, Wednesday 3-5 PM",
      contactInfo: "dr.smith@college.edu | Ext: 1234",
      rating: 4.8,
      totalRatings: 156,
      isOnboarded: true,
    },
  });

  const educator2 = await prisma.user.create({
    data: {
      clerkId: "user_educator_002",
      email: "prof.wilson@college.edu",
      firstName: "Prof. Sarah",
      lastName: "Wilson",
      role: "EDUCATOR",
      departmentId: departments[1].id, // EE
      designation: "Associate Professor",
      facultyId: "FAC002",
      bio: "Associate Professor specializing in Power Systems and Renewable Energy",
      specialization: "Power Systems, Renewable Energy, Smart Grids",
      researchInterests: JSON.stringify(["Solar Energy", "Wind Power", "Microgrids"]),
      publications: JSON.stringify([
        "Renewable Energy Systems (2024)",
        "Smart Grid Technologies (2023)",
      ]),
      officeHours: "Tuesday 10-12 PM, Thursday 2-4 PM",
      contactInfo: "prof.wilson@college.edu | Ext: 1235",
      rating: 4.6,
      totalRatings: 98,
      isOnboarded: true,
    },
  });

  const educator3 = await prisma.user.create({
    data: {
      clerkId: "user_educator_003",
      email: "dr.patel@college.edu",
      firstName: "Dr. Raj",
      lastName: "Patel",
      role: "EDUCATOR",
      departmentId: departments[5].id, // MBA
      designation: "Assistant Professor",
      facultyId: "FAC003",
      bio: "Assistant Professor of Management with expertise in Digital Marketing and Business Strategy",
      specialization: "Digital Marketing, Business Strategy, Entrepreneurship",
      researchInterests: JSON.stringify(["Digital Marketing", "E-commerce", "Startup Ecosystems"]),
      publications: JSON.stringify([
        "Digital Marketing in the Modern Age (2024)",
        "Entrepreneurship and Innovation (2023)",
      ]),
      officeHours: "Friday 1-3 PM",
      contactInfo: "dr.patel@college.edu | Ext: 1236",
      rating: 4.9,
      totalRatings: 124,
      isOnboarded: true,
    },
  });

  // Students
  const student1 = await prisma.user.create({
    data: {
      clerkId: "user_student_001",
      email: "alice.johnson@student.college.edu",
      firstName: "Alice",
      lastName: "Johnson",
      role: "LEARNER",
      departmentId: departments[0].id, // CSE
      enrollmentId: "CSE2022001",
      year: "3",
      branch: "Computer Science Engineering",
      isOnboarded: true,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      clerkId: "user_student_002",
      email: "bob.martin@student.college.edu",
      firstName: "Bob",
      lastName: "Martin",
      role: "LEARNER",
      departmentId: departments[0].id, // CSE
      enrollmentId: "CSE2021045",
      year: "4",
      branch: "Computer Science Engineering",
      isOnboarded: true,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      clerkId: "user_student_003",
      email: "carol.davis@student.college.edu",
      firstName: "Carol",
      lastName: "Davis",
      role: "LEARNER",
      departmentId: departments[1].id, // EE
      enrollmentId: "EE2022015",
      year: "2",
      branch: "Electrical Engineering",
      isOnboarded: true,
    },
  });

  console.log(`✅ Created ${1 + 3 + 3} users (1 admin, 3 educators, 3 students)`);

  // Update department heads
  await prisma.department.update({
    where: { id: departments[0].id },
    data: { headOfDepartmentId: educator1.id },
  });

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: "Artificial Intelligence and Machine Learning",
      subtitle: "Comprehensive AI/ML course from fundamentals to advanced applications",
      description:
        "Master the fundamentals of Artificial Intelligence and Machine Learning. Learn algorithms, neural networks, deep learning, and real-world applications.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
      price: 0, // Free for enrolled students
      isPublished: true,
      instructorId: educator1.id,
      departmentId: departments[0].id,
      categoryId: categories[0].id,
      subCategoryId: categories[0].subCategories[0].id,
      levelId: levels[2].id, // Advanced
      tags: JSON.stringify(["AI", "Machine Learning", "Deep Learning", "Python", "TensorFlow"]),
      academicYear: "2024-2025",
      creditHours: 4,
      duration: "14 weeks",
      visibility: "DEPARTMENT",
      enrollmentCount: 45,
      rating: 4.7,
      totalRatings: 38,
      completionRate: 78.5,
      prerequisites: JSON.stringify(["Data Structures", "Linear Algebra", "Python Programming"]),
      learningOutcomes: JSON.stringify([
        "Understand core AI/ML concepts and algorithms",
        "Build and train neural networks using TensorFlow",
        "Apply machine learning to real-world problems",
        "Evaluate and optimize ML models",
      ]),
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Power Systems and Smart Grids",
      subtitle: "Modern electrical power systems and renewable energy integration",
      description:
        "Explore modern power systems, smart grid technologies, and renewable energy integration. Learn about power generation, transmission, distribution, and grid optimization.",
      imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
      price: 0,
      isPublished: true,
      instructorId: educator2.id,
      departmentId: departments[1].id,
      categoryId: categories[0].id,
      subCategoryId: categories[0].subCategories[1].id,
      levelId: levels[1].id, // Intermediate
      tags: JSON.stringify(["Power Systems", "Smart Grids", "Renewable Energy", "Electrical Engineering"]),
      academicYear: "2024-2025",
      creditHours: 3,
      duration: "12 weeks",
      visibility: "DEPARTMENT",
      enrollmentCount: 32,
      rating: 4.5,
      totalRatings: 28,
      completionRate: 85.0,
      prerequisites: JSON.stringify(["Circuit Analysis", "Electromagnetic Theory"]),
      learningOutcomes: JSON.stringify([
        "Understand power system components and operation",
        "Analyze smart grid technologies",
        "Design renewable energy integration solutions",
        "Optimize grid performance and reliability",
      ]),
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Digital Marketing Mastery",
      subtitle: "Complete guide to modern digital marketing strategies",
      description:
        "Master digital marketing from SEO and content marketing to social media and analytics. Learn to create effective campaigns and measure ROI.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      price: 0,
      isPublished: true,
      instructorId: educator3.id,
      departmentId: departments[5].id,
      categoryId: categories[2].id,
      subCategoryId: categories[2].subCategories[1].id,
      levelId: levels[0].id, // Beginner
      tags: JSON.stringify(["Digital Marketing", "SEO", "Social Media", "Content Marketing", "Analytics"]),
      academicYear: "2024-2025",
      creditHours: 3,
      duration: "10 weeks",
      visibility: "PUBLIC",
      enrollmentCount: 68,
      rating: 4.9,
      totalRatings: 54,
      completionRate: 92.0,
      prerequisites: JSON.stringify([]),
      learningOutcomes: JSON.stringify([
        "Develop comprehensive digital marketing strategies",
        "Master SEO and content marketing",
        "Create effective social media campaigns",
        "Analyze and optimize marketing performance",
      ]),
    },
  });

  const course4 = await prisma.course.create({
    data: {
      title: "Data Structures and Algorithms",
      subtitle: "Foundation course for competitive programming and software engineering",
      description:
        "Build strong foundations in data structures and algorithms. Essential for technical interviews and competitive programming.",
      imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
      price: 0,
      isPublished: true,
      instructorId: educator1.id,
      departmentId: departments[0].id,
      categoryId: categories[0].id,
      subCategoryId: categories[0].subCategories[0].id,
      levelId: levels[1].id, // Intermediate
      tags: JSON.stringify(["DSA", "Algorithms", "Data Structures", "Programming", "Problem Solving"]),
      academicYear: "2024-2025",
      creditHours: 4,
      duration: "16 weeks",
      visibility: "PUBLIC",
      enrollmentCount: 102,
      rating: 4.8,
      totalRatings: 89,
      completionRate: 76.0,
      prerequisites: JSON.stringify(["Programming Fundamentals", "Basic Mathematics"]),
      learningOutcomes: JSON.stringify([
        "Implement common data structures",
        "Analyze algorithm complexity",
        "Solve complex programming problems",
        "Prepare for technical interviews",
      ]),
    },
  });

  console.log(`✅ Created ${4} courses with full details`);

  // Create Course Analytics
  await Promise.all([
    prisma.courseAnalytics.create({
      data: {
        courseId: course1.id,
        totalEnrollments: 45,
        completionRate: 78.5,
        averageRating: 4.7,
        averageQuizScore: 82.3,
        totalDiscussions: 23,
        averageTimeSpent: 48.5,
      },
    }),
    prisma.courseAnalytics.create({
      data: {
        courseId: course2.id,
        totalEnrollments: 32,
        completionRate: 85.0,
        averageRating: 4.5,
        averageQuizScore: 79.8,
        totalDiscussions: 15,
        averageTimeSpent: 42.0,
      },
    }),
    prisma.courseAnalytics.create({
      data: {
        courseId: course3.id,
        totalEnrollments: 68,
        completionRate: 92.0,
        averageRating: 4.9,
        averageQuizScore: 88.5,
        totalDiscussions: 31,
        averageTimeSpent: 35.2,
      },
    }),
    prisma.courseAnalytics.create({
      data: {
        courseId: course4.id,
        totalEnrollments: 102,
        completionRate: 76.0,
        averageRating: 4.8,
        averageQuizScore: 75.6,
        totalDiscussions: 47,
        averageTimeSpent: 62.8,
      },
    }),
  ]);

  // Create Enrollments
  await Promise.all([
    prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: course1.id,
        progress: 65,
        isCompleted: false,
      },
    }),
    prisma.enrollment.create({
      data: {
        studentId: student1.id,
        courseId: course4.id,
        progress: 100,
        isCompleted: true,
      },
    }),
    prisma.enrollment.create({
      data: {
        studentId: student2.id,
        courseId: course1.id,
        progress: 85,
        isCompleted: false,
      },
    }),
    prisma.enrollment.create({
      data: {
        studentId: student2.id,
        courseId: course3.id,
        progress: 100,
        isCompleted: true,
      },
    }),
    prisma.enrollment.create({
      data: {
        studentId: student3.id,
        courseId: course2.id,
        progress: 42,
        isCompleted: false,
      },
    }),
  ]);

  console.log(`✅ Created sample enrollments`);

  // Create Course Ratings
  await Promise.all([
    prisma.courseRating.create({
      data: {
        studentId: student1.id,
        courseId: course4.id,
        rating: 5,
        review: "Excellent course! Dr. Smith explains complex concepts very clearly.",
      },
    }),
    prisma.courseRating.create({
      data: {
        studentId: student2.id,
        courseId: course3.id,
        rating: 5,
        review: "Best digital marketing course I've taken. Highly practical and engaging!",
      },
    }),
    prisma.courseRating.create({
      data: {
        studentId: student3.id,
        courseId: course2.id,
        rating: 4,
        review: "Great content on smart grids. Would love more hands-on projects.",
      },
    }),
  ]);

  console.log(`✅ Created course ratings`);

  // Create Discussions
  const discussion1 = await prisma.discussion.create({
    data: {
      title: "Understanding Neural Network Backpropagation",
      content:
        "Can someone explain how backpropagation works in neural networks? I understand the forward pass but struggling with gradient calculations.",
      category: "COURSE",
      authorId: student1.id,
      courseId: course1.id,
      departmentId: departments[0].id,
      views: 45,
      isResolved: true,
    },
  });

  const discussion2 = await prisma.discussion.create({
    data: {
      title: "Smart Grid Communication Protocols",
      content:
        "What are the most commonly used communication protocols in smart grids? Looking for comparisons between IEC 61850 and DNP3.",
      category: "COURSE",
      authorId: student3.id,
      courseId: course2.id,
      departmentId: departments[1].id,
      views: 23,
      isResolved: false,
    },
  });

  const discussion3 = await prisma.discussion.create({
    data: {
      title: "CSE Department Coding Competition",
      content:
        "Our department is organizing a coding competition next month. Who's interested in participating? Topics will include DSA and problem-solving.",
      category: "DEPARTMENT",
      authorId: student2.id,
      departmentId: departments[0].id,
      views: 78,
      isPinned: true,
    },
  });

  console.log(`✅ Created discussions`);

  // Create Comments with nested replies
  const comment1 = await prisma.comment.create({
    data: {
      discussionId: discussion1.id,
      authorId: educator1.id,
      content:
        "Great question! Backpropagation is essentially the chain rule applied to neural networks. The gradient flows backward from the output layer to the input layer, updating weights at each layer.",
      isBestAnswer: true,
      upvotes: 12,
    },
  });

  await prisma.comment.create({
    data: {
      discussionId: discussion1.id,
      authorId: student2.id,
      parentCommentId: comment1.id,
      content: "Thanks Dr. Smith! This really clarifies things. Would you recommend any specific resources for deeper understanding?",
      upvotes: 3,
    },
  });

  await prisma.comment.create({
    data: {
      discussionId: discussion2.id,
      authorId: educator2.id,
      content:
        "Both protocols have their advantages. IEC 61850 is designed specifically for substation automation, while DNP3 is more general-purpose. I'll cover this in detail in next week's lecture.",
      upvotes: 8,
    },
  });

  console.log(`✅ Created comments with nested replies`);

  console.log("\n🎉 College LMS Database seeded successfully!\n");
  console.log("📊 Summary:");
  console.log(`   - ${departments.length} Departments`);
  console.log(`   - ${categories.length} Categories with subcategories`);
  console.log(`   - 1 Admin, 3 Educators, 3 Students`);
  console.log(`   - 4 Courses with ratings and analytics`);
  console.log(`   - Sample enrollments, discussions, and comments`);
  console.log("\n🔐 Demo Login Credentials:");
  console.log("   Admin: user_admin_001");
  console.log("   Educator 1: user_educator_001 (Dr. John Smith - CSE)");
  console.log("   Educator 2: user_educator_002 (Prof. Sarah Wilson - EE)");
  console.log("   Educator 3: user_educator_003 (Dr. Raj Patel - MBA)");
  console.log("   Student 1: user_student_001 (Alice Johnson - CSE Year 3)");
  console.log("   Student 2: user_student_002 (Bob Martin - CSE Year 4)");
  console.log("   Student 3: user_student_003 (Carol Davis - EE Year 2)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
