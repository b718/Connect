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
    "../../../../back_end/connect-back-end/serverless"
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
      timeout: Duration.seconds(30),
      memorySize: 1024,
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
