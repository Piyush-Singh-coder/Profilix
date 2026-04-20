import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const profile = await prisma.profile.findFirst({
      select: { techStacks: { select: { techId: true }, take: 1 } }
    });
    console.log("Profile success", profile);
  } catch (e: any) {
    console.error("Profile ERROR:", e.message);
  }

  try {
    const count = await prisma.education.count();
    console.log("Education count success", count);
  } catch (e: any) {
    console.error("Education ERROR:", e.message);
  }
}

main();
