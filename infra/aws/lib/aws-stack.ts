import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import createTestsBucket from "../resources/s3/answerKeyBucket";
import createFetchTestFromTestsBucketLambda from "../resources/lambda/fetchTestFromTestsBucketLambda";

export class ConnectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const testsBuckets = createTestsBucket(this);
    createFetchTestFromTestsBucketLambda(this, testsBuckets.bucketName);
  }
}
