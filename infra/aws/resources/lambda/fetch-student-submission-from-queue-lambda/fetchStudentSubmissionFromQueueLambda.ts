import { Queue } from "aws-cdk-lib/aws-sqs";
import { ConnectStack } from "../../../lib/aws-stack";
import {
  Architecture,
  DockerImageCode,
  DockerImageFunction,
} from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { join } from "path";
import { Duration } from "aws-cdk-lib";

export default function fetchStudentSubmissionFromQueueLambda(
  connectStack: ConnectStack,
  studentSubmissionQueue: Queue
) {
  const fetchStudentSubmissionFromQueueLambdaId =
    "connect-fetch-student-submission-from-queue-lambda";
  const fetchStudentSubmissionFromQueueDockerAssetPath = join(
    __dirname,
    "../../../../../back_end/connect-back-end"
  );

  const fetchStudentSubmissionFromQueueDockerImage =
    DockerImageCode.fromImageAsset(
      fetchStudentSubmissionFromQueueDockerAssetPath,
      { file: "Dockerfile" }
    );

  const fetchStudentSubmissionFromQueueLambda = new DockerImageFunction(
    connectStack,
    fetchStudentSubmissionFromQueueLambdaId,
    {
      code: fetchStudentSubmissionFromQueueDockerImage,
      architecture: Architecture.X86_64,
      timeout: Duration.seconds(60),
      memorySize: 1024,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        STUDENT_SUBMISSION_QUEUE_URL:
          process.env.STUDENT_SUBMISSION_QUEUE_URL ?? "",
        PRE_SIGNED_LAMBDA_URL: process.env.PRE_SIGNED_LAMBDA_URL ?? "",
        GEMINI_API_KEY: process.env.GEMINI_API_KEY ?? "",
      },
    }
  );

  fetchStudentSubmissionFromQueueLambda.addToRolePolicy(
    new PolicyStatement({
      actions: ["sqs:SendMessage", "sqs:ReceiveMessage"],
      resources: [studentSubmissionQueue.queueArn],
    })
  );

  const BATCH_SIZE = 10;
  const studentSubmissionQueueEventSource = new SqsEventSource(
    studentSubmissionQueue,
    {
      batchSize: BATCH_SIZE,
    }
  );

  fetchStudentSubmissionFromQueueLambda.addEventSource(
    studentSubmissionQueueEventSource
  );
}
