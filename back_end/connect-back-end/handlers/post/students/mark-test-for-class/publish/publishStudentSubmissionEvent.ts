import { SQSClient } from "@aws-sdk/client-sqs";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { publishStudentSubmissionToQueue } from "./publishStudentSubmissionToQueue";
import { PrismaClient } from "@prisma/client";
import pino from "pino";

type PublishStudentSubmissionEventResponse = {
  statusCode: number;
  message: string;
};

export default function publishStudentSubmissionEvent(
  databaseClient: PrismaClient,
  studentSubmissionQueueClient: SQSClient
) {
  const successMessage = "successfully published student submission event";
  const errorMessage = "unsuccessfully published student submission event";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const testId = req.params.testId;

    try {
      await publishStudentSubmissionToQueue(
        classId,
        studentId,
        testId,
        studentSubmissionQueueClient
      );

      await markStudentSubmissionAsSubmittedQuery(
        databaseClient,
        testId,
        studentId
      );

      logger.info({ classId: classId, testId: testId }, successMessage);

      createResponse(StatusCodes.OK, successMessage, res);
    } catch (error) {
      logger.info(
        { classId: classId, testId: testId, err: error },
        errorMessage
      );

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, res);
    }
  };
}

function createResponse(statusCode: number, message: string, res: Response) {
  const response: PublishStudentSubmissionEventResponse = {
    statusCode: statusCode,
    message: message,
  };

  res.status(statusCode).json(response);
}

async function markStudentSubmissionAsSubmittedQuery(
  databaseClient: PrismaClient,
  testId: string,
  studentId: string
) {
  const studentSubmission = await databaseClient.studentTestResults.update({
    where: {
      testsTableId_studentsTableId: {
        testsTableId: testId,
        studentsTableId: studentId,
      },
    },
    data: {
      isSubmitted: true,
    },
  });

  return studentSubmission;
}
