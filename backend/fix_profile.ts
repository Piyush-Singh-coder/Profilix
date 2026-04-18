import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProfile() {
  const username = "piyush-singh-coder";
  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    console.log(`User ${username} not found.`);
    return;
  }

  const updatedProfile = await prisma.profile.update({
    where: { userId: user.id },
    data: { isPublic: true }
  });

  console.log(`Successfully made profile public for ${username}.`);
  console.log(`Current isPublic status: ${updatedProfile.isPublic}`);
}

fixProfile()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
