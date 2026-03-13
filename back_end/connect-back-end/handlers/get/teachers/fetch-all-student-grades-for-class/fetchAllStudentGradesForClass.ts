import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import fetchAnswerKeyUrl from "../../shared/fetch-answer-key-url/fetchAnswerKeyUrl";
import pino from "pino";

type StudentGrades = {
  studentId: string;
  firstName: string;
  lastName: string;
  testName: string;
  testId: string;
  testGrade: number;
  testCreationDate: Date;
  viewAnswerKeyUrl: string | undefined;
  manualInterventionRequired: boolean;
  isGraded: boolean;
};

type FetchAllStudentGradesForClassResponse = {
  statusCode: number;
  message: string;
  data: StudentGrades[];
};

export default function fetchAllStudentGradesForClass(
  databaseClient: PrismaClient,
) {
  const successMessage =
    "successfully queried all student grades for specific class";
  const errorMessage =
    "unsuccessfully queried all student grades for specific class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;

    try {
      const studentGradesForClass: PromiseSettledResult<StudentGrades>[] =
        await fetchAllStudentGradesForClassQuery(databaseClient, classId);
      logger.info({ classId: classId }, successMessage);

      createResponse(
        StatusCodes.OK,
        successMessage,
        studentGradesForClass,
        res,
      );
    } catch (error) {
      logger.error({ classId: classId, err: error }, errorMessage);

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, [], res);
    }
  };
}

async function fetchAllStudentGradesForClassQuery(
  databaseClient: PrismaClient,
  classId: string,
) {
  const allStudentGrades = await databaseClient.studentTestResults.findMany({
    where: {
      student: {
        classes: {
          some: {
            classId: classId,
          },
        },
      },
      test: {
        classesTableId: classId,
      },
    },
    select: {
      student: {
        select: {
          studentId: true,
          firstName: true,
          lastName: true,
        },
      },
      test: {
        select: {
          testId: true,
          testName: true,
          createdAt: true,
        },
      },
      testGrade: true,
      manualInterventionRequired: true,
      isGraded: true,
    },
    orderBy: {
      test: {
        createdAt: "asc",
      },
    },
  });

  const testClassIdToAnswerKeyUrl = new Map<string, Promise<string>>();

  allStudentGrades.forEach((studentGrade) => {
    const testId = studentGrade.test.testId;
    const testClassIdKey = testId + ":" + classId;

    if (!testClassIdToAnswerKeyUrl.has(testClassIdKey)) {
      const viewAnswerKeyUrl = fetchAnswerKeyUrl(classId, testId);
      testClassIdToAnswerKeyUrl.set(testClassIdKey, viewAnswerKeyUrl);
    }
  });

  return Promise.allSettled(
    allStudentGrades.map(async (value) => {
      const testClassIdKey = value.test.testId + ":" + classId;

      return {
        ...value.student,
        testId: value.test.testId,
        testName: value.test.testName,
        testCreationDate: value.test.createdAt,
        testGrade: value.testGrade,
        manualInterventionRequired: value.manualInterventionRequired,
        isGraded: value.isGraded,
        viewAnswerKeyUrl: await testClassIdToAnswerKeyUrl.get(testClassIdKey),
      };
    }),
  );
}

function createResponse(
  statusCode: number,
  message: string,
  data: PromiseSettledResult<StudentGrades>[],
  res: Response,
) {
  const response: FetchAllStudentGradesForClassResponse = {
    statusCode,
    message,
    data: data
      .filter((studentGrade) => studentGrade.status != "rejected")
      .map((studentGrade) => studentGrade.value),
  };

  res.status(statusCode).json(response);
}
