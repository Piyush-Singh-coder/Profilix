import dotenv from "dotenv";
dotenv.config();

import { extractStructuredDetails } from "../services/resumeParser.service";

const dummyResumeText = `
Piyush Singh
Software Engineer | Python, JavaScript, Go
Phone: +91 98765 43210
Email: piyush@example.com
GitHub: github.com/piyush
LinkedIn: linkedin.com/in/piyush

Professional Summary:
Passionate Software Engineer with 3+ years of experience building scalable backend systems and responsive web applications. Specialized in Node.js, React, and PostgreSQL.

Experience:
Senior Software Engineer | Tech Corp | Bangalore, India | Jan 2024 - Present
- Led a team of 4 developers to rebuild the core analytics engine, reducing query latency by 45%.
- Designed and implemented a real-time notification system using WebSockets and Redis.
- Orchestrated transition from monolithic architecture to microservices on AWS.

Software Engineer | StartUp Inc | Bangalore, India | Jun 2022 - Dec 2023
- Developed 10+ frontend features using React.js and Tailwind CSS, increasing user engagement by 20%.
- Optimized database queries in PostgreSQL, leading to a 30% reduction in database load.

Education:
Bachelor of Technology in Computer Science
XYZ University | 2018 - 2022
CGPA: 8.9 / 10

Projects:
Issue Tracker | github.com/piyush/issue-tracker | live-demo.com
- Built a collaborative project management tool with Kanban boards using Next.js and Prisma.
- Handled real-time updates using WebSockets.

Achievements:
Winner of Smart India Hackathon 2022
- Led the team to win the first prize under the Ministry of Education theme.

Skills:
Programming Languages: JavaScript, TypeScript, Python, Go, SQL
Frameworks & Libraries: React, Next.js, Node.js, Express, FastAPI
Databases: PostgreSQL, Redis, MongoDB
`;

async function runTest() {
  console.log("Starting test parse...");
  const start = Date.now();
  try {
    const data = await extractStructuredDetails(dummyResumeText);
    console.log("Parse succeeded in", (Date.now() - start) / 1000, "seconds");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Parse failed after", (Date.now() - start) / 1000, "seconds:", error);
  }
}

runTest();
