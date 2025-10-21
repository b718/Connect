import type { Express } from "express";
import pino from "pino";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

export default async function startServer(databaseClient: PrismaClient) {
  const logger = pino({
    name: "connected-back-end/index.ts",
  });

  const app: Express = express();
  app.use(cors());

  const SERVER_PORT = process.env.SERVER_PORT || 3003;

  app.listen(SERVER_PORT, () => {
    logger.info(`starting server at port: ${SERVER_PORT}`);
  });
}
