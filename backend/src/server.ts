import { env } from "./config/env";
import app from "./app";
import { prisma } from "./config/database";

const PORT = parseInt(env.PORT, 10);

const startServer = async () => {
  try {
    // Test DB connection before accepting traffic
    await prisma.$connect();
    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Profilix API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
