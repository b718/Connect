import { PrismaClient, StudentTestResults } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import sendResponse from "../../../../utilities/sendResponse";

type FetchStudentSubmissionGradeResponse = {
  statusCode: number;
  message: string;
  data: StudentTestResults | null;
};

export default function fetchStudentSubmissionGrade(
  databaseClient: PrismaClient,
) {
  const successMessage = "successfully fetched student submission grade";
  const errorMessage = "unsuccessfully fetched student submission grade";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { studentId, testId } = req.params;
    const response: FetchStudentSubmissionGradeResponse = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: null,
    };

    try {
      const studentSubmission = await fetchStudentSubmissionQuery(
        databaseClient,
        studentId,
        testId,
      );
      response.statusCode = StatusCodes.OK;
      response.message = successMessage;
      response.data = studentSubmission;
    } catch (error) {
      logger.error(
        { studentId: studentId, testId: testId, err: error },
        errorMessage,
      );
    } finally {
      sendResponse<FetchStudentSubmissionGradeResponse>(
        res,
        response.statusCode,
        response,
      );
    }
  };
}

async function fetchStudentSubmissionQuery(
  databaseClient: PrismaClient,
  studentId: string,
  testId: string,
) {
  const studentSubmission = await databaseClient.studentTestResults.findUnique({
    where: {
      testsTableId_studentsTableId: {
        studentsTableId: studentId,
        testsTableId: testId,
      },
    },
  });

  return studentSubmission;
}
