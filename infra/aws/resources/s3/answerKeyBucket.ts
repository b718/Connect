import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { ConnectStack } from "../../lib/aws-stack";

export default function createTestsBucket(connectStack: ConnectStack) {
  const testsBucketId = "connect-tests-bucket";
  const testsBucket = new Bucket(connectStack, testsBucketId, {
    bucketName: "connect-tests-bucket",
    cors: [
      {
        allowedHeaders: ["*"],
        allowedMethods: [HttpMethods.PUT],
        allowedOrigins: ["*"],
      },
    ],
  });

  return testsBucket;
}
