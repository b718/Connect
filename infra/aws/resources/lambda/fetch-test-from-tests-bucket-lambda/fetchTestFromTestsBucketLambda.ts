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

export default function createFetchTestFromTestsBucketLambda(
  connectStack: ConnectStack,
  bucketName: string
) {
  const fetchTestFromTestsBucketLambdaId =
    "connect-fetch-test-from-tests-bucket-lambda";
  const fetchTestFromTestsBucketLambdaCode = Code.fromAsset(
    "./resources/lambda/fetch-test-from-tests-bucket-lambda/scripts/get-presigned-url-lambda"
  );

  const fetchTestFromTestsBucketLambda = new Function(
    connectStack,
    fetchTestFromTestsBucketLambdaId,
    {
      code: fetchTestFromTestsBucketLambdaCode,
      handler: "main.lambda_handler",
      runtime: Runtime.PYTHON_3_12,
    }
  );

  const bucketArn = `arn:aws:s3:::${bucketName}`;
  const bucketObjectsArn = `${bucketArn}/*`;

  fetchTestFromTestsBucketLambda.addToRolePolicy(
    new PolicyStatement({
      actions: ["s3:ListBucket"],
      resources: [bucketArn],
    })
  );

  fetchTestFromTestsBucketLambda.addToRolePolicy(
    new PolicyStatement({
      actions: ["s3:GetObject", "s3:GetObjectVersion"],
      resources: [bucketObjectsArn],
    })
  );

  const getPresignedUrlLambdaFunctionUrlId =
    "connectGetPresignedUrlLambdaFunctionUrl";

  new FunctionUrl(connectStack, getPresignedUrlLambdaFunctionUrlId, {
    function: fetchTestFromTestsBucketLambda,
    authType: FunctionUrlAuthType.NONE,
    cors: {
      allowedOrigins: ["*"],
      allowedMethods: [HttpMethod.POST],
      allowedHeaders: ["*"],
    },
  });
}
