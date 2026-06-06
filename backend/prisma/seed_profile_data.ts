import { PrismaClient, AuthProvider, AchievementType, SocialPlatform, ProfileStatus, ProfileTheme, CardTheme } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting profile data seeding...");

  // 1. Find or create a user to attach the profile data to
  let user = await prisma.user.findFirst({
    where: {
      email: "piyush@example.com",
    },
  });

  if (!user) {
    // If no user with that email, check if there's any user in the database
    user = await prisma.user.findFirst();
  }

  if (!user) {
    console.log("Creating default user 'piyush'...");
    user = await prisma.user.create({
      data: {
        email: "piyush@example.com",
        username: "piyush",
        fullName: "Piyush Singh",
        isVerified: true,
        authProvider: AuthProvider.EMAIL,
      },
    });
  }

  console.log(`Using User: ${user.fullName} (${user.email}) [ID: ${user.id}]`);

  // Clear existing items to avoid duplicates and ensure a fresh clean state
  await prisma.experience.deleteMany({ where: { userId: user.id } });
  await prisma.project.deleteMany({ where: { userId: user.id } });
  await prisma.achievement.deleteMany({ where: { userId: user.id } });
  await prisma.profileSkill.deleteMany({ where: { userId: user.id } });
  await prisma.customSection.deleteMany({ where: { userId: user.id } });
  await prisma.education.deleteMany({ where: { userId: user.id } });
  await prisma.socialLink.deleteMany({ where: { userId: user.id } });

  // 2. Create or Update Profile
  const professionalSummary = 
    "Dedicated and results-oriented Software Engineer with a strong foundation in Computer Science and extensive experience in developing high-performance full-stack applications. Expert in backend engineering with Node.js, FastAPI, and Go, coupled with modern frontend development using React and Next.js. Passionate about AI integrations, having built retrieval-augmented generation (RAG) systems and large language model (LLM) workflows with LangChain and vector databases. Experienced in deploying scalable microservices using Docker, optimizing relational and non-relational databases, and implementing robust CI/CD pipelines. A proactive collaborator and problem solver, committed to clean code, architectural best practices, and delivering high-impact solutions that solve complex real-world business challenges.";

  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      displayName: "Piyush Singh",
      bio: professionalSummary,
      location: "San Francisco, CA",
      phoneNumber: "+1 (555) 019-2834",
      status: ProfileStatus.LOOKING_FOR_ROLES,
      isPublic: true,
      theme: ProfileTheme.DARK,
      cardTheme: CardTheme.GLASS,
    },
    create: {
      userId: user.id,
      displayName: "Piyush Singh",
      bio: professionalSummary,
      location: "San Francisco, CA",
      phoneNumber: "+1 (555) 019-2834",
      status: ProfileStatus.LOOKING_FOR_ROLES,
      isPublic: true,
      theme: ProfileTheme.DARK,
      cardTheme: CardTheme.GLASS,
    },
  });

  console.log("✅ Profile upserted successfully");

  // 3. Seed Experiences (3 items, 3 bullets each)
  await prisma.experience.createMany({
    data: [
      {
        userId: user.id,
        company: "Google",
        role: "Software Engineer",
        location: "Mountain View, CA",
        startDate: new Date("2024-01-01"),
        isCurrent: true,
        bullets: [
          "Designed and implemented high-throughput microservices using Go and Node.js, reducing API response times by 35% across core search services.",
          "Integrated LLM workflows and semantic search capabilities using LangChain and vector databases, enhancing search relevance by 20%.",
          "Collaborated with cross-functional teams to design and deploy scalable REST APIs, handling over 10M+ daily active requests."
        ],
        displayOrder: 0,
      },
      {
        userId: user.id,
        company: "Stripe",
        role: "Full Stack Developer",
        location: "San Francisco, CA",
        startDate: new Date("2022-06-01"),
        endDate: new Date("2023-12-31"),
        isCurrent: false,
        bullets: [
          "Engineered high-fidelity responsive user interfaces using Next.js, React, and TailwindCSS, improving user engagement metrics by 15%.",
          "Developed robust backend endpoints with Node.js and Express, implementing rate limiting and caching to secure sensitive API endpoints.",
          "Optimized complex PostgreSQL queries and indexing schemas, reducing database server CPU utilization by 40% under peak loads."
        ],
        displayOrder: 1,
      },
      {
        userId: user.id,
        company: "Meta",
        role: "Software Engineer Intern",
        location: "New York, NY",
        startDate: new Date("2021-05-01"),
        endDate: new Date("2021-08-31"),
        isCurrent: false,
        bullets: [
          "Built interactive dashboards and reporting features using React.js and TypeScript, empowering internal teams with real-time analytics.",
          "Implemented robust unit and integration tests with Jest, increasing test coverage from 65% to 92% across front-end repositories.",
          "Automated deployment pipelines using Docker and GitHub Actions, speeding up release cycles by 25%."
        ],
        displayOrder: 2,
      },
    ],
  });
  console.log("✅ Seeded 3 Experiences");

  // 4. Seed Projects (3 items, 3 bullets each)
  await prisma.project.createMany({
    data: [
      {
        userId: user.id,
        title: "CardPortfolio Application",
        description: "A professional developer portfolio and digital card generator.",
        repoUrl: "https://github.com/Piyush-Singh-coder/Profilix",
        liveUrl: "https://profilix.dev",
        techTags: ["Next.js", "PostgreSQL", "Docker", "Zustand"],
        bullets: [
          "Designed a dynamic bento-style grid landing page displaying real-time analytics, tech stacks, and digital card previews.",
          "Implemented complex custom field creator allowing users to add custom headers, bulleted lists, and personalized ordering.",
          "Optimized resume generation system utilizing Puppeteer to render pixel-perfect, highly customized PDF and Word templates."
        ],
        displayOrder: 0,
      },
      {
        userId: user.id,
        title: "AI-Powered RAG Search Engine",
        description: "A retrieval-augmented generation platform for enterprise documents.",
        repoUrl: "https://github.com/Piyush-Singh-coder/rag-search",
        techTags: ["FastAPI", "Python", "LangChain", "MongoDB"],
        bullets: [
          "Leveraged LangChain and vector embeddings to build an intelligent search parser achieving 95% accuracy in document retrieval.",
          "Engineered scalable data ingestion pipelines that clean, chunk, and index PDFs into a vector store in real-time.",
          "Developed a high-performance backend with FastAPI serving requests in under 150ms using connection pooling."
        ],
        displayOrder: 1,
      },
      {
        userId: user.id,
        title: "Go-Fiber Microservice Gateway",
        description: "A high-performance gateway routing and rate limiting API traffic.",
        repoUrl: "https://github.com/Piyush-Singh-coder/go-gateway",
        techTags: ["Go", "Redis", "Docker"],
        bullets: [
          "Implemented custom middleware in Go (Fiber) for JWT authentication, request logging, and structured JSON responses.",
          "Configured Redis-based sliding window rate limiter, managing traffic spikes up to 50k requests per second.",
          "Designed a centralized service registry and health checking system, improving microservice availability to 99.99%."
        ],
        displayOrder: 2,
      },
    ],
  });
  console.log("✅ Seeded 3 Projects");

  // 5. Seed Achievements (5 items)
  await prisma.achievement.createMany({
    data: [
      {
        userId: user.id,
        title: "Winner - HackMIT 2024",
        provider: "MIT",
        type: AchievementType.HACKATHON,
        date: new Date("2024-09-15"),
        description: "Placed 1st out of 300+ teams for building a decentralized AI-powered medical diagnosis assistant.",
        displayOrder: 0,
      },
      {
        userId: user.id,
        title: "AWS Certified Solutions Architect - Associate",
        provider: "Amazon Web Services",
        type: AchievementType.CERTIFICATE,
        date: new Date("2023-11-20"),
        description: "Validated expertise in designing distributed systems on AWS, with emphasis on cost-optimization and security.",
        displayOrder: 1,
      },
      {
        userId: user.id,
        title: "Google Hash Code Global Finalist",
        provider: "Google",
        type: AchievementType.COMPETITION,
        date: new Date("2022-04-10"),
        description: "Ranked in the top 100 globally out of 10,000+ participating teams in Google's team-based programming competition.",
        displayOrder: 2,
      },
      {
        userId: user.id,
        title: "Dean's Honor List",
        provider: "University",
        type: AchievementType.AWARD,
        date: new Date("2022-06-01"),
        description: "Awarded academic excellence honors for maintaining a GPA of 3.96/4.00 for consecutive semesters.",
        displayOrder: 3,
      },
      {
        userId: user.id,
        title: "Open Source Contributor of the Year",
        provider: "GitHub",
        type: AchievementType.OTHER,
        date: new Date("2023-12-05"),
        description: "Recognized for significant contributions to core Python repositories and LangChain integration libraries.",
        displayOrder: 4,
      },
    ],
  });
  console.log("✅ Seeded 5 Achievements");

  // 6. Seed Custom Skills (Categories and Skills list)
  await prisma.profileSkill.createMany({
    data: [
      {
        userId: user.id,
        category: "Programming Languages",
        skills: ["Java", "Python", "Go", "JavaScript", "TypeScript", "C"],
        displayOrder: 0,
      },
      {
        userId: user.id,
        category: "Computer Science Fundamentals",
        skills: ["Data Structures & Algorithms", "Object-Oriented Programming", "Operating Systems", "DBMS"],
        displayOrder: 1,
      },
      {
        userId: user.id,
        category: "Backend & Systems",
        skills: ["Node.js", "Express.js", "FastAPI", "Go(Fiber, Chi)", "REST API Design", "Scalable System Design"],
        displayOrder: 2,
      },
      {
        userId: user.id,
        category: "Frontend",
        skills: ["React.js", "Next.js", "TailwindCSS", "Zustand", "Daisyui"],
        displayOrder: 3,
      },
      {
        userId: user.id,
        category: "Databases",
        skills: ["PostgreSQL", "MySQL", "MongoDB"],
        displayOrder: 4,
      },
      {
        userId: user.id,
        category: "AI / Generative AI",
        skills: ["LLM Integration", "RAG (Retrieval-Augmented Generation)", "Vector Databases", "Embeddings", "LangChain", "LangGraph"],
        displayOrder: 5,
      },
      {
        userId: user.id,
        category: "Tools & Platforms",
        skills: ["Git", "Docker", "Postman", "Firebase", "Supabase", "Neon"],
        displayOrder: 6,
      },
    ],
  });
  console.log("✅ Seeded Custom Skills");

  // 7. Seed Custom Sections (one custom field)
  await prisma.customSection.create({
    data: {
      userId: user.id,
      title: "Languages Known",
      bullets: [
        "English (Professional Working Proficiency)",
        "Hindi (Native or Bilingual Proficiency)",
        "Spanish (Elementary Proficiency)"
      ],
      displayOrder: 0,
    },
  });
  console.log("✅ Seeded Custom Section (Languages)");

  // 8. Seed Social Links
  await prisma.socialLink.createMany({
    data: [
      {
        userId: user.id,
        platform: SocialPlatform.GITHUB,
        url: "https://github.com/Piyush-Singh-coder",
      },
      {
        userId: user.id,
        platform: SocialPlatform.LINKEDIN,
        url: "https://linkedin.com/in/piyush-singh",
      },
      {
        userId: user.id,
        platform: SocialPlatform.TWITTER,
        url: "https://twitter.com/piyush_singh",
      },
    ],
  });
  console.log("✅ Seeded Social Links");

  // 9. Seed Education
  await prisma.education.create({
    data: {
      userId: user.id,
      school: "Massachusetts Institute of Technology (MIT)",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: new Date("2018-09-01"),
      endDate: new Date("2022-06-01"),
      scoreType: "GPA",
      score: "3.96/4.00",
      description: "Graduated with Honors. Specialization in Intelligent Systems and Distributed Computing. Coursework included advanced algorithms, machine learning, and operating systems design.",
      displayOrder: 0,
    },
  });
  console.log("✅ Seeded Education");

  console.log("✨ Seeding profile data completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
