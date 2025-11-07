import { SQSClient } from "@aws-sdk/client-sqs";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { publishStudentSubmissionToQueue } from "./publishStudentSubmissionToQueue";
import pino from "pino";

type PublishStudentSubmissionEventResponse = {
  statusCode: number;
  message: string;
};

function createPublishStudentSubmissionEventResponse(
  statusCode: number,
  message: string,
  res: Response
) {
  const response: PublishStudentSubmissionEventResponse = {
    statusCode: statusCode,
    message: message,
  };

  res.status(statusCode).json(response);
}

export default function publishStudentSubmissionEvent() {
  const successMessage = "successfully published student submission event";
  const errorMessage = "unsuccessfully published student submission event";
  const logger = pino({
    name: "handlers/post/mark-test-for-class/publish/publishStudentSubmissionEvent.ts",
  });
  const studentSubmissionQueueClient = new SQSClient({});

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const testId = req.params.testId;

    try {
      const studentSubmission = await publishStudentSubmissionToQueue(
        classId,
        studentId,
        testId,
        studentSubmissionQueueClient
      );

      logger.info({
        classId: classId,
        testId: testId,
        message: successMessage,
      });

      createPublishStudentSubmissionEventResponse(
        StatusCodes.OK,
        successMessage,
        res
      );
    } catch (error) {
      console.log(error);
      logger.info({
        classId: classId,
        testId: testId,
        error: error,
        message: errorMessage,
      });

      createPublishStudentSubmissionEventResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        res
      );
    }
  };
}
