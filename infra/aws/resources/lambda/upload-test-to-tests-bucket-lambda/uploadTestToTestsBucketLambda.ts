import {
  Code,
  Function,
  FunctionUrl,
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { ConnectStack } from "../../../lib/aws-stack";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export default function uploadTestToTestsBucketLambda(
  connectStack: ConnectStack,
  bucketName: string
) {
  const uploadTestToTestsBucketLambdaId =
    "connect-upload-test-to-tests-bucket-lambda";
  const uploadTestToTestsBucketLambdaCode = Code.fromAsset(
    "./resources/lambda/upload-test-to-tests-bucket-lambda/scripts/get-upload-presigned-url-lambda"
  );

  const fetchTestFromTestsBucketLambda = new Function(
    connectStack,
    uploadTestToTestsBucketLambdaId,
    {
      code: uploadTestToTestsBucketLambdaCode,
      handler: "main.lambda_handler",
      runtime: Runtime.PYTHON_3_12,
    }
  );

  const bucketArn = `arn:aws:s3:::${bucketName}`;

  fetchTestFromTestsBucketLambda.addToRolePolicy(
    new PolicyStatement({
      actions: ["s3:PutObject"],
      resources: [`${bucketArn}/*`],
    })
  );

  const uploadTestPresignedLambdaUrlId = "connectUploadTestPresignedLambdaUrl";

  new FunctionUrl(connectStack, uploadTestPresignedLambdaUrlId, {
    function: fetchTestFromTestsBucketLambda,
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ["*"],
      allowedMethods: [HttpMethod.PUT],
      allowedHeaders: ["*"],
    },
  });
}
