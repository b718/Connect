import { Prisma, PrismaClient, Students, Tests } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import { getTeacherTestUploadPresignedUrl } from "./getTeacherUploadTestUrl";

type CreateTestForClassRequest = {
  testName: string;
};

type CreateTestForClassRequestResponse = {
  statusCode: number;
  testId: string;
  presignedUrl: string;
  message: string;
};

async function findTest(
  databaseClient: PrismaClient,
  testName: string,
  classId: string
) {
  const existingTest = await databaseClient.tests.findUnique({
    where: {
      testName_classesTableId: {
        testName: testName,
        classesTableId: classId,
      },
    },
  });

  return existingTest;
}

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
    const STARTING_GRADE = 100;

    return {
      testsTableId: newTest.testId,
      studentsTableId: student.studentId,
      testGrade: STARTING_GRADE,
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
  presignedUrl: string,
  res: Response
) {
  const response: CreateTestForClassRequestResponse = {
    statusCode,
    testId,
    presignedUrl,
    message,
  };

  res.status(statusCode).json(response);
}

export default function createTestForClass(databaseClient: PrismaClient) {
  const successMessage = "successfully created test for all students in class";
  const errorMessage = "unsuccessfully created test for all students in class";
  const logger = pino({
    name: "handlers/post/create-test-for-class/createTestForClass.ts",
  });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const data: CreateTestForClassRequest = req.body;

    try {
      let newTest = await findTest(databaseClient, data.testName, classId);

      if (!newTest) {
        newTest = await databaseClient.$transaction(async (transaction) => {
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

          return newTest;
        });
      }

      const presignedUrl = await getTeacherTestUploadPresignedUrl(
        classId,
        newTest.testId
      );

      logger.info({
        classId: classId,
        testName: data.testName,
        testId: newTest.testId,
        message: successMessage,
      });

      createCreateTestForClassRequestResponse(
        StatusCodes.OK,
        successMessage,
        newTest.testId,
        presignedUrl,
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
        "",
        res
      );
    }
  };
}
