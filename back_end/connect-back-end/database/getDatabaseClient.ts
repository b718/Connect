import { PrismaClient } from "@prisma/client";

export default function getDatabaseClient() {
  const databaseClient = new PrismaClient();
  return databaseClient;
}
