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

  res.send(response);
}

async function getStudentGradesForTestQuery(
  databaseClient: PrismaClient,
  testId: string
) {
  const studentGradesForTest = await databaseClient.tests.findMany({
    where: {
      testId: testId,
    },
    include: {
      studentTestResults: true,
    },
  });

  return studentGradesForTest;
}
export default function getStudentGradesForTest(databaseClient: PrismaClient) {
  return async function (req: Request, res: Response) {
    const logger = pino({
      name: "handlers/get-student-grades-for-test/getStudentGradesForTest.ts",
    });
    const testId = req.params.testId;

    try {
      const studentGradesForTest = await getStudentGradesForTestQuery(
        databaseClient,
        testId
      );
      createGetStudentGradesForTestResponse(
        StatusCodes.OK,
        "successfully queried student grades for specific test",
        studentGradesForTest,
        res
      );
      logger.info(
        "successfully queried student grades for specific testId, testId: " +
          testId
      );
    } catch (error) {
      logger.info(
        "unsuccessfully queried student grades for specific testId, testId: " +
          testId +
          "error: " +
          error
      );
      createGetStudentGradesForTestResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "unsuccessfully queried student grades for specific test",
        [],
        res
      );
    }
  };
}
