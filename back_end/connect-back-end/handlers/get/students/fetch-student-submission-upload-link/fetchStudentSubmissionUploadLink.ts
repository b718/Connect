import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { fetchUploadUrl } from "./fetchUploadUrl";
import pino from "pino";

type FetchStudentSubmissionUploadLinkResponse = {
  statusCode: number;
  message: string;
  presignedUrl: string;
};

export default function fetchStudentSubmissionUploadLink() {
  const successMessage = "successfully uploaded test for student";
  const errorMessage = "unsuccessfully uploaded test for student";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const testId = req.params.testId;

    try {
      const presignedUrl = await fetchUploadUrl(classId, testId, studentId);
      logger.info({ classId: classId, testId: testId }, successMessage);

      createResponse(StatusCodes.OK, successMessage, presignedUrl, res);
    } catch (error) {
      logger.info(
        { classId: classId, testId: testId, err: error },
        errorMessage
      );

      createResponse(StatusCodes.OK, errorMessage, "", res);
    }
  };
}

function createResponse(
  statusCode: number,
  message: string,
  presignedUrl: string,
  res: Response
) {
  const response: FetchStudentSubmissionUploadLinkResponse = {
    statusCode: statusCode,
    message: message,
    presignedUrl: presignedUrl,
  };

  res.status(statusCode).json(response);
}
