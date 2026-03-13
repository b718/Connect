import { PrismaClient, Tests } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import fetchAnswerKeyUrl from "../../shared/fetch-answer-key-url/fetchAnswerKeyUrl";

type TestsWithPresignedUrls = Tests & {
  answerKeyUrl: string;
};

type FetchTestsResponse = {
  statusCode: number;
  message: string;
  data: TestsWithPresignedUrls[];
};

export default function fetchTests(databaseClient: PrismaClient) {
  const successMessage = "successfully fetched tests";
  const errorMessage = "unsuccessfully fetched tests";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { classId } = req.params;
    const response: FetchTestsResponse = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: [],
    };

    try {
      const tests = await fetchTestsQuery(databaseClient, classId);
      const testsWithPresignedUrls = await fetchTestPresignedUrl(
        tests,
        classId,
      );
      response.statusCode = StatusCodes.OK;
      response.message = successMessage;
      response.data = testsWithPresignedUrls;
      logger.info({ totalTests: tests.length, classId: classId }, successMessage);
    } catch (error) {
      logger.error({ err: error, classId: classId }, errorMessage);
    } finally {
      res.status(response.statusCode).json(response);
    }
  };
}

async function fetchTestsQuery(databaseClient: PrismaClient, classId: string) {
  const tests = await databaseClient.tests.findMany({
    where: { classesTableId: classId },
    orderBy: { createdAt: "asc" },
  });
  return tests;
}

async function fetchTestPresignedUrl(tests: Tests[], classId: string) {
  return Promise.all(
    tests.map(async (test) => {
      const answerKeyUrl = await fetchAnswerKeyUrl(classId, test.testId);
      return {
        ...test,
        answerKeyUrl,
      };
    }),
  );
}
