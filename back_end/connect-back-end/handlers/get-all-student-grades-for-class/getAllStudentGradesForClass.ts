import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type AllStudentGradeForClass = {
  studentId: string;
  firstName: string;
  lastName: string;
  testName: string;
  testId: string;
  testGrade: number;
  testCreationDate: Date;
};

type GetAllStudentGradesForClassResponse = {
  statusCode: number;
  message: string;
  data: AllStudentGradeForClass[];
};

function createGetAllStudentGradesForClassResponse(
  statusCode: number,
  message: string,
  data: AllStudentGradeForClass[],
  res: Response
) {
  const response: GetAllStudentGradesForClassResponse = {
    statusCode,
    message,
    data,
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
      },
      orderBy: {
        test: {
          createdAt: "asc",
        },
      },
    });

  return allStudentGradesForClass.map((value) => {
    return {
      ...value.student,
      testId: value.test.testId,
      testName: value.test.testName,
      testCreationDate: value.test.createdAt,
      testGrade: value.testGrade,
    };
  });
}

export default function getAllStudentGradesForClass(
  databaseClient: PrismaClient
) {
  const successMessage =
    "successfully queried all student grades for specific class";
  const errorMessage =
    "unsuccessfully queried all student grades for specific class";
  const logger = pino({
    name: "handlers/get-all-student-grades-for-class/getAllStudentGradesForClass.ts",
  });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;

    try {
      const allStudentGradesForClass = await getAllStudentGradesForClassQuery(
        databaseClient,
        classId
      );

      logger.info({
        message: successMessage,
        classId: classId,
      });

      createGetAllStudentGradesForClassResponse(
        StatusCodes.OK,
        successMessage,
        allStudentGradesForClass,
        res
      );
    } catch (error) {
      logger.error({
        classId: classId,
        error: error,
        message: errorMessage,
      });

      createGetAllStudentGradesForClassResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
