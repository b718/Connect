import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type PatchStudentSubmissionGradeRequest = {
  newGrade: number;
};

type PatchStudentSubmissionGradeResponse = {
  statusCode: number;
  message: string;
  newGrade: number;
};

async function updateStudentSubmissionQuery(
  databaseClient: PrismaClient,
  studentId: string,
  testId: string,
  newGrade: number
) {
  const updatedStudentSubmission =
    await databaseClient.studentTestResults.update({
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

  return updatedStudentSubmission;
}

function createPatchStudentSubmissionGradeResponse(
  statusCode: number,
  message: string,
  newGrade: number,
  res: Response
) {
  const response: PatchStudentSubmissionGradeResponse = {
    statusCode: statusCode,
    message: message,
    newGrade: newGrade,
  };

  res.status(statusCode).json(response);
}

export default function patchStudentSubmissionGrade(
  databaseClient: PrismaClient
) {
  const successMessage = "successfully updated grade for student";
  const errorMessage = "unsuccessfully updated grade for student";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const studentId = req.params.studentId;
    const testId = req.params.testId;
    const data: PatchStudentSubmissionGradeRequest = req.body;

    try {
      const updatedStudentSubmission = await updateStudentSubmissionQuery(
        databaseClient,
        studentId,
        testId,
        data.newGrade
      );

      logger.info({
        studentId: studentId,
        testId: testId,
        newGrade: data.newGrade,
        message: successMessage,
      });

      createPatchStudentSubmissionGradeResponse(
        StatusCodes.OK,
        successMessage,
        updatedStudentSubmission.testGrade,
        res
      );
    } catch (error) {
      logger.info({
        studentId: studentId,
        testId: testId,
        message: errorMessage,
      });

      createPatchStudentSubmissionGradeResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        -1,
        res
      );
    }
  };
}
