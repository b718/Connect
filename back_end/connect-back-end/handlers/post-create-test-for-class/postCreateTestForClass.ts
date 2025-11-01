import { Prisma, PrismaClient, Students, Tests } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type CreateTestForClassRequest = {
  testName: string;
};

type CreateTestForClassRequestResponse = {
  statusCode: number;
  testId: string;
  message: string;
};

async function createNewTest(
  transactionClient: Prisma.TransactionClient,
  testName: string,
  classId: string
) {
  const newTest = await transactionClient.tests.create({
    data: {
      testName: testName,
      classesTableId: classId,
    },
  });

  return newTest;
}

async function getAllStudentGradesForClass(
  transactionClient: Prisma.TransactionClient,
  classId: string
) {
  const allStudents = await transactionClient.students.findMany({
    where: {
      classes: {
        some: {
          classId: classId,
        },
      },
    },
  });

  return allStudents;
}

async function createStudentTestResultsForNewTest(
  transactionClient: Prisma.TransactionClient,
  newTest: Tests,
  studentsInClass: Students[]
) {
  const dataToBeConnected = studentsInClass.map((student) => {
    return {
      testsTableId: newTest.testId,
      studentsTableId: student.studentId,
      testGrade: 100,
    };
  });

  await transactionClient.studentTestResults.createMany({
    data: dataToBeConnected,
  });
}

function createCreateTestForClassRequestResponse(
  statusCode: number,
  message: string,
  testId: string,
  res: Response
) {
  const response: CreateTestForClassRequestResponse = {
    statusCode,
    testId,
    message,
  };

  res.status(statusCode).json(response);
}

export default function postCreateTestForClass(databaseClient: PrismaClient) {
  const successMessage = "successfully created test for all students in class";
  const errorMessage = "unsuccessfully created test for all students in class";
  const logger = pino({
    name: "handlers/post-create-test-for-class/postCreateTestForClass.ts",
  });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const data: CreateTestForClassRequest = req.body;

    try {
      const testId = await databaseClient.$transaction(async (transaction) => {
        const newTest = await createNewTest(
          transaction,
          data.testName,
          classId
        );

        const allStudents = await getAllStudentGradesForClass(
          transaction,
          classId
        );

        await createStudentTestResultsForNewTest(
          transaction,
          newTest,
          allStudents
        );

        return newTest.testId;
      });

      logger.info({
        classId: classId,
        testName: data.testName,
        testId: testId,
        message: successMessage,
      });

      createCreateTestForClassRequestResponse(
        StatusCodes.OK,
        successMessage,
        testId,
        res
      );
    } catch (error) {
      logger.error({
        classId: classId,
        testName: data.testName,
        error: error,
        message: errorMessage,
      });

      createCreateTestForClassRequestResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        "",
        res
      );
    }
  };
}
