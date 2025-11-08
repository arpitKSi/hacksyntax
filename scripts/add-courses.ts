const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Get categories and subcategories
    const itCategory = await database.category.findFirst({
      where: { name: "IT & Software" },
      include: { subCategories: true },
    });

    const businessCategory = await database.category.findFirst({
      where: { name: "Business" },
      include: { subCategories: true },
    });

    const designCategory = await database.category.findFirst({
      where: { name: "Design" },
      include: { subCategories: true },
    });

    // Get levels
    const beginnerLevel = await database.level.findFirst({
      where: { name: "Beginner" },
    });

    const intermediateLevel = await database.level.findFirst({
      where: { name: "Intermediate" },
    });

    const expertLevel = await database.level.findFirst({
      where: { name: "Expert" },
    });

    // Sample courses
    const courses = [
      {
        instructorId: "instructor_demo_1",
        title: "Complete Web Development Bootcamp",
        subtitle: "Master HTML, CSS, JavaScript, React, Node.js and more",
        description: "Learn web development from scratch with this comprehensive bootcamp. Build real-world projects and become a full-stack developer.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        price: 49.99,
        isPublished: true,
        categoryId: itCategory?.id,
        subCategoryId: itCategory?.subCategories.find((s: any) => s.name === "Web Development")?.id,
        levelId: beginnerLevel?.id,
      },
      {
        instructorId: "instructor_demo_2",
        title: "Data Science and Machine Learning",
        subtitle: "Python for Data Science, Machine Learning & AI",
        description: "Master data science and machine learning with Python. Learn pandas, numpy, scikit-learn, and build ML models.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        price: 79.99,
        isPublished: true,
        categoryId: itCategory?.id,
        subCategoryId: itCategory?.subCategories.find((s: any) => s.name === "Data Science")?.id,
        levelId: intermediateLevel?.id,
      },
      {
        instructorId: "instructor_demo_3",
        title: "Digital Marketing Masterclass",
        subtitle: "SEO, Social Media, Email Marketing & More",
        description: "Learn digital marketing strategies to grow your business. Master SEO, social media marketing, and email campaigns.",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        price: 39.99,
        isPublished: true,
        categoryId: businessCategory?.id,
        subCategoryId: businessCategory?.subCategories.find((s: any) => s.name === "Marketing")?.id,
        levelId: beginnerLevel?.id,
      },
      {
        instructorId: "instructor_demo_1",
        title: "UI/UX Design Fundamentals",
        subtitle: "Design Beautiful User Interfaces",
        description: "Learn user interface and user experience design principles. Master Figma and create stunning designs.",
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        price: 59.99,
        isPublished: true,
        categoryId: designCategory?.id,
        subCategoryId: designCategory?.subCategories.find((s: any) => s.name === "Graphic Design")?.id,
        levelId: beginnerLevel?.id,
      },
      {
        instructorId: "instructor_demo_2",
        title: "Cybersecurity Essentials",
        subtitle: "Protect Systems and Networks from Cyber Threats",
        description: "Learn cybersecurity fundamentals, ethical hacking, and how to protect systems from cyber attacks.",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        price: 69.99,
        isPublished: true,
        categoryId: itCategory?.id,
        subCategoryId: itCategory?.subCategories.find((s: any) => s.name === "Cybersecurity")?.id,
        levelId: intermediateLevel?.id,
      },
      {
        instructorId: "instructor_demo_3",
        title: "E-Commerce Business Blueprint",
        subtitle: "Build and Scale Your Online Store",
        description: "Learn how to start and grow a successful e-commerce business. From product selection to scaling.",
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800",
        price: 44.99,
        isPublished: true,
        categoryId: businessCategory?.id,
        subCategoryId: businessCategory?.subCategories.find((s: any) => s.name === "E-Commerce")?.id,
        levelId: beginnerLevel?.id,
      },
    ];

    // Create courses
    for (const course of courses) {
      if (course.categoryId && course.subCategoryId) {
        await database.course.create({
          data: course,
        });
      }
    }

    console.log("Sample courses added successfully!");
  } catch (error) {
    console.log("Error adding courses:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
