import bcrypt from "bcrypt";
import prisma from "../infrastructure/db";

export async function seedAdminUser(): Promise<void> {
  const existing = await prisma.user.findUnique({
    where: { email: "admin@test.com" },
  });
  if (existing) return;

  const hash = await bcrypt.hash("123456", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@test.com",
      password: hash,
    },
  });
  console.log("[Seed] Admin user created: admin@test.com");
}
