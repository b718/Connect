import { SQSClient } from "@aws-sdk/client-sqs";
import { GoogleGenAI } from "@google/genai";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { dequeueStudentSubmissionFromQueue } from "./dequeueStudentSubmissionFromQueue";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type DequeueStudentSubmissionEventResponse = {
  statusCode: number;
  message: string;
};

function createDequeueStudentSubmissionEventResponse(
  statusCode: number,
  message: string,
  res: Response
) {
  const response: DequeueStudentSubmissionEventResponse = {
    statusCode: statusCode,
    message: message,
  };

  res.status(statusCode).json(response);
}

export default function dequeueStudentSubmissionEvent(
  databaseClient: PrismaClient
) {
  const successMessage = "successfully graded student submission event";
  const errorMessage = "unsuccessfully graded student submission event";
  const logger = pino({
    name: "handlers/post/mark-test-for-class/dequeue/dequeueStudentSubmissionEvent.ts",
  });
  const studentSubmissionQueueClient = new SQSClient({});
  const geminiClient = new GoogleGenAI({});

  return async function (_req: Request, res: Response) {
    try {
      const totalProcessedStudentSubmissions =
        await dequeueStudentSubmissionFromQueue(
          databaseClient,
          studentSubmissionQueueClient,
          geminiClient,
          logger
        );

      logger.info({
        processedEvents: totalProcessedStudentSubmissions,
        message: successMessage,
      });

      createDequeueStudentSubmissionEventResponse(
        StatusCodes.OK,
        successMessage,
        res
      );
    } catch (error) {
      logger.error({
        error: error,
        message: errorMessage,
      });

      createDequeueStudentSubmissionEventResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        res
      );
    }
  };
}
