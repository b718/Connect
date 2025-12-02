import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import getAnswerKeyUrl from "./getAnswerKeyUrl";
import pino from "pino";

type AllStudentGradeForClass = {
  studentId: string;
  firstName: string;
  lastName: string;
  testName: string;
  testId: string;
  testGrade: number;
  testCreationDate: Date;
  viewAnswerKeyUrl: string | undefined;
  manualInterventionRequired: boolean;
};

type GetAllStudentGradesForClassResponse = {
  statusCode: number;
  message: string;
  data: AllStudentGradeForClass[];
};

function createGetAllStudentGradesForClassResponse(
  statusCode: number,
  message: string,
  data: PromiseSettledResult<AllStudentGradeForClass>[],
  res: Response
) {
  const response: GetAllStudentGradesForClassResponse = {
    statusCode,
    message,
    data: data
      .filter(
        (allStudentGradeForClass) =>
          allStudentGradeForClass.status != "rejected"
      )
      .map((allStudentGradeForClass) => allStudentGradeForClass.value),
  };

  res.status(statusCode).json(response);
}

async function getAllStudentGradesForClassQuery(
  databaseClient: PrismaClient,
  classId: string
) {
  const allStudentGradesForClass =
    await databaseClient.studentTestResults.findMany({
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
      },
      orderBy: {
        test: {
          createdAt: "asc",
        },
      },
    });

  const testClassIdToAnswerKeyUrl = new Map<string, Promise<string>>();

  allStudentGradesForClass.forEach((studentGrade) => {
    const testId = studentGrade.test.testId;
    const testClassIdKey = testId + ":" + classId;

    if (!testClassIdToAnswerKeyUrl.has(testClassIdKey)) {
      const viewAnswerKeyUrl = getAnswerKeyUrl(classId, testId);
      testClassIdToAnswerKeyUrl.set(testClassIdKey, viewAnswerKeyUrl);
    }
  });

  return Promise.allSettled(
    allStudentGradesForClass.map(async (value) => {
      const testClassIdKey = value.test.testId + ":" + classId;

      return {
        ...value.student,
        testId: value.test.testId,
        testName: value.test.testName,
        testCreationDate: value.test.createdAt,
        testGrade: value.testGrade,
        manualInterventionRequired: value.manualInterventionRequired,
        viewAnswerKeyUrl: await testClassIdToAnswerKeyUrl.get(testClassIdKey),
      };
    })
  );
}

export default function getAllStudentGradesForClass(
  databaseClient: PrismaClient
) {
  const successMessage =
    "successfully queried all student grades for specific class";
  const errorMessage =
    "unsuccessfully queried all student grades for specific class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;

    try {
      const allStudentGradesForClass: PromiseSettledResult<AllStudentGradeForClass>[] =
        await getAllStudentGradesForClassQuery(databaseClient, classId);

      logger.info({
        classId: classId,
        message: successMessage,
      });

      createGetAllStudentGradesForClassResponse(
        StatusCodes.OK,
        successMessage,
        allStudentGradesForClass,
        res
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error({
          classId: classId,
          error: error.message,
          message: errorMessage,
        });
      }

      createGetAllStudentGradesForClassResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
