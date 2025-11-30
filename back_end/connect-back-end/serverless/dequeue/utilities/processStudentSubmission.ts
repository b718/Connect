import { GoogleGenAI } from "@google/genai";
import { Logger } from "pino";
import { PrismaClient, Prisma } from "@prisma/client";
import { gradeTest } from "./gradeTest";
import { SQSRecord } from "aws-lambda";

export async function processStudentSubmission(
  databaseClient: PrismaClient,
  geminiClient: GoogleGenAI,
  studentSubmissionMessage: SQSRecord,
  logger: Logger
) {
  const successMessage = "succesfully graded student submission";
  const failureMessage = "unsuccesfully graded student submission";

  const dataRecord = studentSubmissionMessage.messageAttributes!;
  const classId = dataRecord["ClassId"].stringValue!;
  const studentId = dataRecord["StudentId"].stringValue!;
  const testId = dataRecord["TestId"].stringValue!;

  try {
    logger.info(
      {
        body: studentSubmissionMessage.body,
        attributes: dataRecord,
        classId: classId,
        studentId: studentId,
        testId: testId,
      },
      "processing student submission"
    );

    const gradeStudentSubmission = await gradeTest(
      geminiClient,
      classId,
      studentId,
      testId,
      logger
    );

    const data: Prisma.StudentTestResultsUpdateInput = {
      testGrade: gradeStudentSubmission.grade,
    };

    if (!gradeStudentSubmission.confident) {
      data.manualInterventionRequired = true;
    }

    await databaseClient.studentTestResults.update({
      data,
      where: {
        testsTableId_studentsTableId: {
          testsTableId: testId,
          studentsTableId: studentId,
        },
      },
    });

    logger.info(
      {
        studentId: studentId,
        testId: testId,
        classId: classId,
      },
      successMessage
    );
  } catch (error) {
    logger.error(
      {
        studentId: studentId,
        testId: testId,
        classId: classId,
        err: error,
      },
      failureMessage
    );
    throw error;
  }
}
