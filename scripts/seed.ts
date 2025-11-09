const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const database = new PrismaClient();

async function main() {
  try {
    // Create categories (skip if exist)
    const existingCategories = await database.category.count();
    if (existingCategories === 0) {
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

      // Sequentially create each category with its subcategories
      for (const category of categories) {
        await database.category.create({
          data: {
            name: category.name,
            subCategories: category.subCategories,
          },
          include: {
            subCategories: true,
          },
        });
      }
      console.log("✅ Categories created");
    } else {
      console.log("ℹ️ Categories already exist");
    }

    // Create levels (skip if exist)
    const existingLevels = await database.level.count();
    if (existingLevels === 0) {
      await database.level.createMany({
        data: [
          { name: "Beginner" },
          { name: "Intermediate" },
          { name: "Expert" },
          { name: "All levels" },
        ],
      });
      console.log("✅ Levels created");
    } else {
      console.log("ℹ️ Levels already exist");
    }

    // Create test users with hashed passwords (skip if exist)
    const existingUsers = await database.user.count();
    if (existingUsers === 0) {
      const hashedPassword = await bcrypt.hash("demo123", 12);

      // Create admin user
      await database.user.create({
        data: {
          email: "admin@college.edu",
          password: hashedPassword,
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
          imageUrl: "/avatar_placeholder.jpg",
        },
      });

      // Create educator user
      await database.user.create({
        data: {
          email: "educator@college.edu",
          password: hashedPassword,
          firstName: "John",
          lastName: "Educator",
          role: "EDUCATOR",
          imageUrl: "/avatar_placeholder.jpg",
        },
      });

      // Create student user
      await database.user.create({
        data: {
          email: "student@college.edu",
          password: hashedPassword,
          firstName: "Jane",
          lastName: "Student",
          role: "STUDENT",
          imageUrl: "/avatar_placeholder.jpg",
        },
      });

      console.log("✅ Test users created");
      console.log("\n📧 Login Credentials:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("👑 Admin:    admin@college.edu / demo123");
      console.log("👨‍🏫 Educator: educator@college.edu / demo123");
      console.log("👨‍🎓 Student:  student@college.edu / demo123");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    } else {
      console.log("ℹ️ Users already exist");
    }

    console.log("✅ Seeding completed successfully");
  } catch (error) {
    console.log("❌ Seeding failed:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
