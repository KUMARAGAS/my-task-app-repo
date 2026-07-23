import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL Connected...");
  } catch (error) {
    console.log("Error connecting to PostgreSQL:", error);
    throw error;
  }
};

export default prisma;
