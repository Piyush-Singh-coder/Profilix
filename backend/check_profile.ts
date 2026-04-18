import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkProfile() {
  const username = "Piyush-Singh-coder";
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { username: username.toLowerCase() }
      ]
    },
    include: {
      profile: true
    }
  });

  if (!user) {
    console.log(`User ${username} not found regardless of case.`);
    return;
  }

  console.log(`User found: ${user.username} (ID: ${user.id})`);
  if (!user.profile) {
    console.log(`Profile not found for user ${user.username}`);
  } else {
    console.log(`Profile found for user ${user.username}:`);
    console.log(`- isPublic: ${user.profile.isPublic}`);
    console.log(`- theme: ${user.profile.theme}`);
  }
}

checkProfile()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
