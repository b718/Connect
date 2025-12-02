import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getStudentTestUploadPresignedUrl } from "./getStudentUploadTestUrl";
import pino from "pino";

type StudentTestUploadPresignedUrlResponse = {
  statusCode: number;
  presignedUrl: string;
  message: string;
};

function createStudentTestUploadPresignedUrlResponse(
  statusCode: number,
  presignedUrl: string,
  message: string,
  res: Response
) {
  const response: StudentTestUploadPresignedUrlResponse = {
    statusCode: statusCode,
    presignedUrl: presignedUrl,
    message: message,
  };

  res.status(statusCode).json(response);
}

export default function studentTestUploadPresignedUrl() {
  const successMessage = "successfully marked test for student";
  const errorMessage = "unsuccessfully marked test for student";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const studentId = req.params.studentId;
    const testId = req.params.testId;

    try {
      const presignedUrl = await getStudentTestUploadPresignedUrl(
        classId,
        testId,
        studentId
      );

      logger.info({
        classId: classId,
        testId: testId,
        message: successMessage,
      });

      createStudentTestUploadPresignedUrlResponse(
        StatusCodes.OK,
        presignedUrl,
        successMessage,
        res
      );
    } catch (error) {
      logger.info({
        classId: classId,
        testId: testId,
        error: error,
        message: errorMessage,
      });

      createStudentTestUploadPresignedUrlResponse(
        StatusCodes.OK,
        "",
        errorMessage,
        res
      );
    }
  };
}
