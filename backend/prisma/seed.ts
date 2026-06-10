import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../../frontend/src/lib/blogData";

const prisma = new PrismaClient();

const blogSeo: Record<string, { tags: string[]; keywords: string[] }> = {
  "ats-friendly-resume-best-practices": {
    tags: ["ATS Resume", "Resume Builder", "Developer Careers"],
    keywords: [
      "ATS friendly resume",
      "developer resume best practices",
      "software engineer resume",
      "resume keywords",
      "Profilix ATS resume",
    ],
  },
  "how-to-share-portfolio-qr": {
    tags: ["QR Portfolio", "Networking", "Developer Portfolio"],
    keywords: [
      "QR portfolio",
      "share developer portfolio",
      "portfolio QR code",
      "hackathon networking",
      "developer business card",
    ],
  },
  "best-portfolio-formats": {
    tags: ["Developer Portfolio", "Portfolio Design", "Career"],
    keywords: [
      "developer portfolio ideas",
      "best portfolio formats",
      "software engineer portfolio",
      "portfolio design",
      "student developer portfolio",
    ],
  },
  "stand-out-tech-interviews": {
    tags: ["Tech Interviews", "Portfolio Strategy", "Career"],
    keywords: [
      "tech interview portfolio",
      "developer portfolio interview",
      "one page portfolio",
      "software engineer interview",
      "stand out in tech interviews",
    ],
  },
};

// Using string literals for category to avoid @prisma/client enum dependency
// before `prisma generate` is run. After generate, these will be type-safe.
const techStacks = [
  // Languages
  { name: "JavaScript", slug: "javascript", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", slug: "typescript", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "Python", slug: "python", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Go", slug: "go", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { name: "Rust", slug: "rust", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg" },
  { name: "Java", slug: "java", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  { name: "C++", slug: "cpp", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "C#", slug: "csharp", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: "Ruby", slug: "ruby", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" },
  { name: "PHP", slug: "php", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" },
  { name: "Swift", slug: "swift", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" },
  { name: "Kotlin", slug: "kotlin", category: "LANGUAGE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" },
  
  // Frontend
  { name: "React", slug: "react", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", slug: "nextjs", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name: "Vue.js", slug: "vuejs", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" },
  { name: "Angular", slug: "angular", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" },
  { name: "Svelte", slug: "svelte", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" },
  { name: "Tailwind CSS", slug: "tailwindcss", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "Bootstrap", slug: "bootstrap", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" },
  { name: "Redux", slug: "redux", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  { name: "Zustand", slug: "zustand", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/pmndrs/zustand/docs/favicon.ico" },
  { name: "HTML5", slug: "html5", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", slug: "css3", category: "FRONTEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },

  // Backend
  { name: "Node.js", slug: "nodejs", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", slug: "expressjs", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "NestJS", slug: "nestjs", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" },
  { name: "Django", slug: "django", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" },
  { name: "Flask", slug: "flask", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" },
  { name: "Spring Boot", slug: "spring-boot", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
  { name: "Rails", slug: "rails", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg" },
  { name: "FastAPI", slug: "fastapi", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { name: "Gin", slug: "gin", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" },
  { name: "Laravel", slug: "laravel", category: "BACKEND" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" },

  // Databases
  { name: "PostgreSQL", slug: "postgresql", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  { name: "MySQL", slug: "mysql", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name: "MongoDB", slug: "mongodb", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Redis", slug: "redis", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "SQLite", slug: "sqlite", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" },
  { name: "Firebase", slug: "firebase", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "Cassandra", slug: "cassandra", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg" },
  { name: "DynamoDB", slug: "dynamodb", category: "DATABASE" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dynamodb/dynamodb-original.svg" },

  // DevOps
  { name: "Docker", slug: "docker", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  { name: "Kubernetes", slug: "kubernetes", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  { name: "GitHub Actions", slug: "github-actions", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg" },
  { name: "Terraform", slug: "terraform", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" },
  { name: "Jenkins", slug: "jenkins", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" },
  { name: "Ansible", slug: "ansible", category: "DEVOPS" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" },

  // Cloud
  { name: "AWS", slug: "aws", category: "CLOUD" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
  { name: "GCP", slug: "gcp", category: "CLOUD" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" },
  { name: "Azure", slug: "azure", category: "CLOUD" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "Vercel", slug: "vercel", category: "CLOUD" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
  { name: "Netlify", slug: "netlify", category: "CLOUD" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg" },

  // Tools
  { name: "Git", slug: "git", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", slug: "github", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "GitLab", slug: "gitlab", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" },
  { name: "Postman", slug: "postman", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  { name: "Figma", slug: "figma", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "GraphQL", slug: "graphql", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  { name: "Prisma", slug: "prisma", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original.svg" },
  { name: "Swagger", slug: "swagger", category: "TOOL" as const, iconUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },

  // CS Core
  { name: "Operating System", slug: "operating-system", category: "CS_CORE" as const },
  { name: "OOPS", slug: "oops", category: "CS_CORE" as const },
  { name: "Data Structure & Algo", slug: "dsa", category: "CS_CORE" as const },
  { name: "Computer Networks", slug: "computer-networks", category: "CS_CORE" as const },
  { name: "DBMS", slug: "dbms", category: "CS_CORE" as const },
  { name: "System Design", slug: "system-design", category: "CS_CORE" as const },
];

async function main() {
  console.log("🌱 Seeding tech stacks...");

  for (const tech of techStacks) {
    await prisma.techStack.upsert({
      where: { slug: tech.slug },
      update: { name: tech.name, iconUrl: tech.iconUrl, category: tech.category },
      create: tech,
    });
  }

  console.log(`✅ Seeded ${techStacks.length} tech stacks`);
  console.log("Seeding blog posts...");

  const adminUser = await prisma.user.findFirst({
    where: {
      OR: [{ username: "pmiaynushi" }, { email: "pmiaynushi@gmail.com" }],
    },
    select: { id: true },
  });

  for (const post of BLOG_POSTS) {
    const seo = blogSeo[post.slug] || { tags: [], keywords: [] };
    const publishedAt = new Date(post.date);
    const authorData = adminUser ? { authorId: adminUser.id } : {};

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        ...authorData,
        title: post.title,
        excerpt: post.description,
        content: post.content.trim(),
        metaTitle: post.title.slice(0, 70),
        metaDescription: post.description.slice(0, 170),
        keywords: seo.keywords,
        tags: seo.tags,
        status: "PUBLISHED",
        publishedAt,
      },
      create: {
        ...authorData,
        slug: post.slug,
        title: post.title,
        excerpt: post.description,
        content: post.content.trim(),
        metaTitle: post.title.slice(0, 70),
        metaDescription: post.description.slice(0, 170),
        keywords: seo.keywords,
        tags: seo.tags,
        status: "PUBLISHED",
        publishedAt,
      },
    });
  }

  console.log(`Seeded ${BLOG_POSTS.length} blog posts`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
