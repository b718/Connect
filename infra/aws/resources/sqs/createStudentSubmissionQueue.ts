import { Queue } from "aws-cdk-lib/aws-sqs";
import { ConnectStack } from "../../lib/aws-stack";
import { AnyPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";

export default function createStudentSubmissionQueue(
  connectStack: ConnectStack
) {
  const sudentSubmissionQueueId = "connect-student-submission-queue";
  const sudentSubmissionQueueName = "connect-student-submission-queue";

  const studentSubmissionQueue = new Queue(
    connectStack,
    sudentSubmissionQueueId,
    {
      queueName: sudentSubmissionQueueName,
    }
  );

  studentSubmissionQueue.addToResourcePolicy(
    new PolicyStatement({
      actions: ["sqs:SendMessage"],
      principals: [new AnyPrincipal()],
      resources: [studentSubmissionQueue.queueArn],
    })
  );
}
