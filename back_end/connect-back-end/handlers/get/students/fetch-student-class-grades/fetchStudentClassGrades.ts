import { getAuth } from "@clerk/express";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type StudentClassGrades = {
  testId: string;
  testName: string;
  testGrade: number;
  isSubmitted: boolean;
  testCreationDate: Date;
};

type FetchStudentClassGradesResponse = {
  statusCode: number;
  message: string;
  data: StudentClassGrades[];
};

function createFetchStudentClassGradesResponse(
  statusCode: number,
  message: string,
  data: StudentClassGrades[],
  res: Response
) {
  const response: FetchStudentClassGradesResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchStudentClassGradesQuery(
  databaseClient: PrismaClient,
  userId: string,
  classId: string
) {
  const studentClassGrades = await databaseClient.studentTestResults.findMany({
    where: {
      student: {
        usersClerkUserId: userId,
      },
      test: {
        classesTableId: classId,
      },
    },
    select: {
      test: true,
      testGrade: true,
      createdAt: true,
      isSubmitted: true,
    },
    orderBy: {
      test: {
        createdAt: "asc",
      },
    },
  });

  return studentClassGrades.map((studentClassGrade) => {
    const response: StudentClassGrades = {
      testId: studentClassGrade.test.testId,
      testName: studentClassGrade.test.testName,
      testGrade: studentClassGrade.testGrade,
      isSubmitted: studentClassGrade.isSubmitted,
      testCreationDate: studentClassGrade.test.createdAt,
    };

    return response;
  });
}

export default function fetchStudentClassGrades(databaseClient: PrismaClient) {
  const successMessage = "successfully fetched grades for class";
  const errorMessage = "unsuccessfully fetched grades for class";
  const logger = pino({
    name: "handlers/get/students/fetch-student-class-grades/fetchStudentClassGrades.ts",
  });

  return async function (req: Request, res: Response) {
    const { userId } = getAuth(req);
    const { classId } = req.params;

    try {
      if (!userId) {
        logger.info(
          { classId: classId },
          "user is not authorized to access endpoint"
        );
        return createFetchStudentClassGradesResponse(
          StatusCodes.OK,
          successMessage,
          [],
          res
        );
      }

      const studentClassGrades = await fetchStudentClassGradesQuery(
        databaseClient,
        userId,
        classId
      );

      logger.info(
        {
          userId: userId,
          classId: classId,
        },
        successMessage
      );

      createFetchStudentClassGradesResponse(
        StatusCodes.OK,
        successMessage,
        studentClassGrades,
        res
      );
    } catch (error) {
      logger.error(
        { userId: userId, classId: classId, err: error },
        errorMessage
      );

      createFetchStudentClassGradesResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
