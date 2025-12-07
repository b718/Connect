import { Request, Response } from "express";
import getStudentSubmissionUrl from "./getStudentSubmissionUrl";
import pino from "pino";
import { StatusCodes } from "http-status-codes";

type GetStudentTestSubmissionResponse = {
  statusCode: number;
  message: string;
  presignedUrl: string;
};

export default function getStudentTestSubmission() {
  const successMessage =
    "successfully fetched student test submission for specific class";
  const errorMessage =
    "unsuccessfully fetched student test submission for specific class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const testId = req.params.testId;

    try {
      const response = await getStudentSubmissionUrl(
        classId,
        studentId,
        testId
      );

      logger.info(
        { classId: classId, studentId: studentId, testId: testId },
        successMessage
      );

      createResponse(
        StatusCodes.OK,
        successMessage,
        response.presignedUrl,
        res
      );
    } catch (error) {
      logger.error(
        { classId: classId, studentId: studentId, testId: testId, err: error },
        errorMessage
      );

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, "", res);
    }
  };
}

function createResponse(
  statusCode: number,
  message: string,
  presignedUrl: string,
  res: Response
) {
  const response: GetStudentTestSubmissionResponse = {
    statusCode: statusCode,
    message: message,
    presignedUrl: presignedUrl,
  };

  res.status(statusCode).json(response);
}
