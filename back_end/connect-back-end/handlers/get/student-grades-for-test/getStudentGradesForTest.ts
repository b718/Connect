import { PrismaClient, Tests } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type GetStudentGradesForTestResponse = {
  statusCode: number;
  message: string;
  data: Tests[];
};

function createGetStudentGradesForTestResponse(
  statusCode: number,
  message: string,
  data: Tests[],
  res: Response
) {
  const response: GetStudentGradesForTestResponse = {
    statusCode,
    message,
    data,
  };

  res.status(statusCode).json(response);
}

async function getStudentGradesForTestQuery(
  databaseClient: PrismaClient,
  testId: string
) {
  const studentGradesForTest = await databaseClient.tests.findUnique({
    where: {
      testId: testId,
    },
    include: {
      studentTestResults: true,
    },
  });

  if (!studentGradesForTest) {
    return [];
  }

  return [studentGradesForTest];
}
export default function getStudentGradesForTest(databaseClient: PrismaClient) {
  const successMessage =
    "successfully queried student grades for specific test";
  const errorMessage =
    "unsuccessfully queried student grades for specific testId";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const testId = req.params.testId;

    try {
      const studentGradesForTest = await getStudentGradesForTestQuery(
        databaseClient,
        testId
      );
      createGetStudentGradesForTestResponse(
        StatusCodes.OK,
        successMessage,
        studentGradesForTest,
        res
      );
      logger.info({
        testId: testId,
        message: successMessage,
      });
    } catch (error) {
      logger.error({
        testId: testId,
        message: errorMessage,
        error: error,
      });

      createGetStudentGradesForTestResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
