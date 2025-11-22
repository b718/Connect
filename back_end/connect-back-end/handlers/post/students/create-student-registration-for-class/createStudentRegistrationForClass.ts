import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type CreateStudentRegistrationForClassResponse = {
  statusCode: number;
  message: string;
};

async function isStudentInClassQuery(
  databaseClient: PrismaClient,
  classId: string,
  studentId: string
) {
  const matchingClasses = await databaseClient.classes.count({
    where: {
      classId: classId,
      students: {
        some: {
          studentId: studentId,
        },
      },
    },
  });

  return matchingClasses > 0;
}

async function createStudentRegistrationForClassQuery(
  databaseClient: PrismaClient,
  classId: string,
  studentId: string
) {
  const STARTING_GRADE = -1;
  const createdStudentRegistrationForClass = await databaseClient.$transaction(
    async (transaction) => {
      const allTestsWithinClass = await transaction.tests.findMany({
        where: {
          classesTableId: classId,
        },
      });

      const studentTestResultsForNewStudent = await Promise.all(
        allTestsWithinClass.map((test) =>
          transaction.studentTestResults.upsert({
            where: {
              testsTableId_studentsTableId: {
                testsTableId: test.testId,
                studentsTableId: studentId,
              },
            },
            update: {},
            create: {
              testsTableId: test.testId,
              studentsTableId: studentId,
              testGrade: STARTING_GRADE,
            },
          })
        )
      );

      await transaction.classes.update({
        where: {
          classId: classId,
        },
        data: {
          students: {
            connect: {
              studentId: studentId,
            },
          },
        },
      });

      return studentTestResultsForNewStudent;
    }
  );

  return createdStudentRegistrationForClass.length;
}

function createCreateStudentRegistrationForClassResponse(
  statusCode: number,
  message: string,
  res: Response
) {
  const response: CreateStudentRegistrationForClassResponse = {
    statusCode: statusCode,
    message: message,
  };

  res.status(statusCode).json(response);
}

export default function createStudentRegistrationForClass(
  databaseClient: PrismaClient
) {
  const successMessage = "successfully added student to class";
  const errorMessage = "unsuccessfully added student to class";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { classId, studentId } = req.params;

    try {
      const isStudentInClass = await isStudentInClassQuery(
        databaseClient,
        classId,
        studentId
      );

      if (isStudentInClass) {
        logger.info(
          { classId: classId, studentId: studentId },
          "student already in class"
        );

        return createCreateStudentRegistrationForClassResponse(
          StatusCodes.BAD_REQUEST,
          "student already in class",
          res
        );
      }

      const testsRegisteredForInNewClass =
        await createStudentRegistrationForClassQuery(
          databaseClient,
          classId,
          studentId
        );

      logger.info(
        {
          classId: classId,
          studentId: studentId,
          testsRegisteredFor: testsRegisteredForInNewClass,
        },
        successMessage
      );

      createCreateStudentRegistrationForClassResponse(
        StatusCodes.OK,
        successMessage,
        res
      );
    } catch (error) {
      logger.error(
        { err: error, classId: classId, studentId: studentId },
        errorMessage
      );

      createCreateStudentRegistrationForClassResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        res
      );
    }
  };
}
