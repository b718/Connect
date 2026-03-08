import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import createTestsBucket from "../resources/s3/answerKeyBucket";
import createFetchTestFromTestsBucketLambda from "../resources/lambda/fetch-test-from-tests-bucket-lambda/fetchTestFromTestsBucketLambda";
import uploadTestToTestsBucketLambda from "../resources/lambda/upload-test-to-tests-bucket-lambda/uploadTestToTestsBucketLambda";
import createStudentSubmissionSqsQueue from "../resources/sqs/createStudentSubmissionQueue";
import fetchStudentSubmissionFromQueueLambda from "../resources/lambda/fetch-student-submission-from-queue-lambda/fetchStudentSubmissionFromQueueLambda";
import * as dotenv from "dotenv";
import connectBackEndServerLambda from "../resources/lambda/connect-back-end-server/connectBackEndServerLambda";

dotenv.config();

export class ConnectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const testsBuckets = createTestsBucket(this);
    createFetchTestFromTestsBucketLambda(this, testsBuckets.bucketName);
    uploadTestToTestsBucketLambda(this, testsBuckets.bucketName);
    const studentSubmissionQueue = createStudentSubmissionSqsQueue(this);
    fetchStudentSubmissionFromQueueLambda(this, studentSubmissionQueue);
    connectBackEndServerLambda(this);
  }
}
