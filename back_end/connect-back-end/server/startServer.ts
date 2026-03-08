import { PrismaClient } from "@prisma/client";
import getServer from "./getServer";
import pino from "pino";

export default async function startServer(databaseClient: PrismaClient) {
  const SERVER_PORT = process.env.SERVER_PORT || 3003;
  const logger = pino({ name: __filename });
  const app = await getServer(databaseClient);

  app.listen(SERVER_PORT, () => {
    logger.info(`starting server at port: ${SERVER_PORT}`);
  });
}
