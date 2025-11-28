import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

export default function getDatabaseClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const databaseClient = new PrismaClient({ adapter: adapter });
  return databaseClient;
}
