import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type PatchStudentGradeRequest = {
  newGrade: number;
};

type PatchStudentGradeResponse = {
  statusCode: number;
  message: string;
  newGrade: number;
};

export default function patchStudentGrade(databaseClient: PrismaClient) {
  const successMessage = "successfully updated grade for student";
  const errorMessage = "unsuccessfully updated grade for student";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const studentId = req.params.studentId;
    const testId = req.params.testId;
    const data: PatchStudentGradeRequest = req.body;

    try {
      const updatedStudentSubmission = await updateStudentGradeQuery(
        databaseClient,
        studentId,
        testId,
        data.newGrade
      );
      logger.info(
        { studentId: studentId, testId: testId, newGrade: data.newGrade },
        successMessage
      );

      createResponse(
        StatusCodes.OK,
        successMessage,
        updatedStudentSubmission.testGrade,
        res
      );
    } catch (error) {
      logger.info(
        { studentId: studentId, testId: testId, err: error },
        errorMessage
      );

      createResponse(StatusCodes.INTERNAL_SERVER_ERROR, errorMessage, -1, res);
    }
  };
}

async function updateStudentGradeQuery(
  databaseClient: PrismaClient,
  studentId: string,
  testId: string,
  newGrade: number
) {
  const updatedStudentGrade = await databaseClient.studentTestResults.update({
    data: {
      manualInterventionRequired: false,
      testGrade: newGrade,
    },
    where: {
      testsTableId_studentsTableId: {
        studentsTableId: studentId,
        testsTableId: testId,
      },
    },
  });

  return updatedStudentGrade;
}

function createResponse(
  statusCode: number,
  message: string,
  newGrade: number,
  res: Response
) {
  const response: PatchStudentGradeResponse = {
    statusCode: statusCode,
    message: message,
    newGrade: newGrade,
  };

  res.status(statusCode).json(response);
}
