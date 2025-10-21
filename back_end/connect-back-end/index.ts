import getDatabaseClient from "./database/getDatabaseClient";
import startServer from "./server/startServer";

function main() {
  const databaseClient = getDatabaseClient();
  startServer(databaseClient);
}

main();
