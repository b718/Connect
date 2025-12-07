import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";

export async function publishStudentSubmissionToQueue(
  classId: string,
  studentId: string,
  testId: string,
  studentSubmissionQueueClient: SQSClient
) {
  const studentSubmissionQueueUrl = process.env.STUDENT_SUBMISSION_QUEUE_URL;
  const studentSubmission = new SendMessageCommand({
    QueueUrl: studentSubmissionQueueUrl,
    DelaySeconds: 10,
    MessageAttributes: {
      ClassId: {
        DataType: "String",
        StringValue: classId,
      },
      StudentId: {
        DataType: "String",
        StringValue: studentId,
      },
      TestId: {
        DataType: "String",
        StringValue: testId,
      },
    },
    MessageBody: createTestSubmissionMessage(classId, studentId, testId),
  });

  try {
    await studentSubmissionQueueClient.send(studentSubmission);
  } catch (error) {
    throw new Error(
      `faced error: ${error} when trying to submit student submission`
    );
  }
}

function createTestSubmissionMessage(
  classId: string,
  studentId: string,
  testId: string
) {
  return `Test '${testId}' submission for student '${studentId}' on ${new Date()} for class '${classId}'`;
}
