const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Create demo users
    const educator1 = await database.user.create({
      data: {
        clerkId: "educator_demo_1",
        email: "educator1@academy.com",
        firstName: "John",
        lastName: "Doe",
        role: "EDUCATOR",
        bio: "Experienced web developer and instructor",
        specialization: "Web Development, JavaScript, React",
        imageUrl: "/avatar_placeholder.jpg",
      },
    });

    const educator2 = await database.user.create({
      data: {
        clerkId: "educator_demo_2",
        email: "educator2@academy.com",
        firstName: "Jane",
        lastName: "Smith",
        role: "EDUCATOR",
        bio: "Data Science expert and AI researcher",
        specialization: "Data Science, Machine Learning, Python",
        imageUrl: "/avatar_placeholder.jpg",
      },
    });

    const learner1 = await database.user.create({
      data: {
        clerkId: "user_demo_123",
        email: "learner@academy.com",
        firstName: "Demo",
        lastName: "User",
        role: "LEARNER",
        imageUrl: "/avatar_placeholder.jpg",
      },
    });

    // Create categories
    const categories = [
      {
        name: "IT & Software",
        subCategories: {
          create: [
            { name: "Web Development" },
            { name: "Data Science" },
            { name: "Cybersecurity" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Business",
        subCategories: {
          create: [
            { name: "E-Commerce" },
            { name: "Marketing" },
            { name: "Finance" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Design",
        subCategories: {
          create: [
            { name: "Graphic Design" },
            { name: "3D & Animation" },
            { name: "Interior Design" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Health",
        subCategories: {
          create: [
            { name: "Fitness" },
            { name: "Yoga" },
            { name: "Nutrition" },
            { name: "Others" },
          ],
        },
      },
    ];

    const createdCategories = [];
    for (const category of categories) {
      const cat = await database.category.create({
        data: {
          name: category.name,
          subCategories: category.subCategories,
        },
        include: {
          subCategories: true,
        },
      });
      createdCategories.push(cat);
    }

    // Create levels
    await database.level.createMany({
      data: [
        { name: "Beginner" },
        { name: "Intermediate" },
        { name: "Expert" },
        { name: "All levels" },
      ],
    });

    const levels = await database.level.findMany();

    // Create courses
    const itCategory = createdCategories.find((c) => c.name === "IT & Software");
    const businessCategory = createdCategories.find((c) => c.name === "Business");
    const designCategory = createdCategories.find((c) => c.name === "Design");

    const course1 = await database.course.create({
      data: {
        instructorId: educator1.id,
        title: "Complete Web Development Bootcamp",
        subtitle: "Master HTML, CSS, JavaScript, React, Node.js and more",
        description: "Learn web development from scratch with this comprehensive bootcamp. Build real-world projects and become a full-stack developer.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        price: 49.99,
        isPublished: true,
        tags: JSON.stringify(["web development", "javascript", "react", "full-stack"]),
        branch: "Computer Science",
        academicYear: "2024-2025",
        categoryId: itCategory.id,
        subCategoryId: itCategory.subCategories.find((s: any) => s.name === "Web Development").id,
        levelId: levels.find((l: any) => l.name === "Beginner").id,
      },
    });

    const course2 = await database.course.create({
      data: {
        instructorId: educator2.id,
        title: "Data Science and Machine Learning",
        subtitle: "Python for Data Science, Machine Learning & AI",
        description: "Master data science and machine learning with Python. Learn pandas, numpy, scikit-learn, and build ML models.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        price: 79.99,
        isPublished: true,
        tags: JSON.stringify(["data science", "python", "machine learning", "AI"]),
        branch: "Computer Science",
        academicYear: "2024-2025",
        categoryId: itCategory.id,
        subCategoryId: itCategory.subCategories.find((s: any) => s.name === "Data Science").id,
        levelId: levels.find((l: any) => l.name === "Intermediate").id,
      },
    });

    // Enroll demo learner in courses
    await database.enrollment.create({
      data: {
        studentId: learner1.id,
        courseId: course1.id,
        progress: 25,
      },
    });

    await database.enrollment.create({
      data: {
        studentId: learner1.id,
        courseId: course2.id,
        progress: 10,
      },
    });

    console.log("✅ Database seeded successfully with enhanced schema!");
    console.log(`Created ${createdCategories.length} categories`);
    console.log("Created 3 users (2 educators, 1 learner)");
    console.log("Created 2 courses with enrollments");
  } catch (error) {
    console.log("❌ Seeding failed:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
