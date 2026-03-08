import getDatabaseClient from "../database/getDatabaseClient";
import getServer from "./getServer";
import serverless from "serverless-http";

const databaseClient = getDatabaseClient();
const app = getServer(databaseClient);

export const handlers = async (event: any, context: any) => {
  const handler = serverless(await app);
  return await handler(event, context);
};
