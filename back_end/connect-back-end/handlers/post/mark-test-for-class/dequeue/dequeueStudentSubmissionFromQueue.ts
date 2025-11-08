import {
  DeleteMessageBatchCommand,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { GoogleGenAI } from "@google/genai";
import { Logger } from "pino";
import { gradeTest } from "./gradeTest";
import { PrismaClient } from "@prisma/client";

type ProcessedEvent = {
  messageId: string | undefined;
  receiptHandle: string | undefined;
};

export async function dequeueStudentSubmissionFromQueue(
  databaseClient: PrismaClient,
  studentSubmissionQueueClient: SQSClient,
  geminiClient: GoogleGenAI,
  logger: Logger
) {
  const processedEvents: ProcessedEvent[] = [];
  const studentSubmissionQueueUrl = process.env.STUDENT_SUBMISSION_QUEUE_URL;
  const dequeueStudentSubmission = new ReceiveMessageCommand({
    QueueUrl: studentSubmissionQueueUrl,
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
  });

  try {
    const studentSubmissions = await studentSubmissionQueueClient.send(
      dequeueStudentSubmission
    );

    if (!studentSubmissions.Messages) {
      logger.info({
        message: "no student submission(s) were found",
      });
      return;
    }

    logger.info({
      message: `processing ${studentSubmissions.Messages.length} event(s)`,
    });

    const gradedStudentSubmissions = await Promise.allSettled(
      studentSubmissions.Messages.map(async (studentSubmission) => {
        const dataRecord = studentSubmission.MessageAttributes!;
        const classId = dataRecord["ClassId"].StringValue!;
        const studentId = dataRecord["StudentId"].StringValue!;
        const testId = dataRecord["TestId"].StringValue!;

        const gradeStudentSubmission = await gradeTest(
          geminiClient,
          classId,
          studentId,
          testId,
          logger
        );

        if (!gradeStudentSubmission.confident) {
          await databaseClient.studentTestResults.update({
            data: {
              manualInterventionRequired: true,
            },
            where: {
              testsTableId_studentsTableId: {
                testsTableId: testId,
                studentsTableId: studentId,
              },
            },
          });
        } else {
          await databaseClient.studentTestResults.update({
            data: {
              testGrade: gradeStudentSubmission.grade,
            },
            where: {
              testsTableId_studentsTableId: {
                testsTableId: testId,
                studentsTableId: studentId,
              },
            },
          });
        }

        logger.info({
          studentId: studentId,
          testId: testId,
          message: "graded student submission",
        });
        return {
          messageId: studentSubmission.MessageId,
          receiptHandle: studentSubmission.ReceiptHandle,
        };
      })
    );

    gradedStudentSubmissions.forEach((gradedStudentSubmission) => {
      if (gradedStudentSubmission.status == "rejected") {
        logger.error({
          failureReason: gradedStudentSubmission.reason,
          message: "grading failed",
        });
        return;
      }

      processedEvents.push({
        messageId: gradedStudentSubmission.value.messageId,
        receiptHandle: gradedStudentSubmission.value.receiptHandle,
      });
    });
  } catch (error) {
    logger.error(error);
    throw new Error("unable to grade student submission");
  }

  if (processedEvents.length > 0) {
    const removeStudentSubmissionsFromQueue =
      await studentSubmissionQueueClient.send(
        new DeleteMessageBatchCommand({
          QueueUrl: studentSubmissionQueueUrl,
          Entries: processedEvents.map((processedEvent) => ({
            Id: processedEvent.messageId,
            ReceiptHandle: processedEvent.receiptHandle,
          })),
        })
      );
  }

  logger.info({
    message: `processed ${processedEvents.length} event(s)`,
  });
  return processedEvents.length;
}
