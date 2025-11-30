import { SQSEvent, Context, SQSHandler, SQSBatchResponse } from "aws-lambda";
import { GoogleGenAI } from "@google/genai";
import { processStudentSubmission } from "./dequeue/utilities/processStudentSubmission";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pino from "pino";

const logger = pino({ name: __filename });
const googleClient = new GoogleGenAI({});
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const databaseClient = new PrismaClient({ adapter: adapter });

export const functionHandler: SQSHandler = async (
  event: SQSEvent,
  _context: Context
): Promise<SQSBatchResponse> => {
  const results = await Promise.allSettled(
    event.Records.map(
      async (record) =>
        await processStudentSubmission(
          databaseClient,
          googleClient,
          record,
          logger
        )
    )
  );

  const batchItemFailures = results
    .map((result, index) => {
      if (result.status === "rejected") {
        logger.error({ reason: result.reason }, "failed to process record");
        return { itemIdentifier: event.Records[index].messageId };
      }
    })
    .filter((item) => item !== undefined);

  return { batchItemFailures: batchItemFailures };
};
