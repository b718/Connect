import { join } from "path";
import { ConnectStack } from "../../../lib/aws-stack";
import {
  Architecture,
  DockerImageCode,
  DockerImageFunction,
} from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

export default function connectBackEndServerLambda(connectStack: ConnectStack) {
  const connectBackEndServerLambdaId = "connect-back-end-server-lambda";
  const connectBackEndServerLambdaDockerAssetPath = join(
    __dirname,
    "../../../../../back_end/connect-back-end",
  );
  const connectBackEndServerLambdaDockerImage = DockerImageCode.fromImageAsset(
    connectBackEndServerLambdaDockerAssetPath,
    { file: "Dockerfile.server" },
  );

  const connectBackEndServerLambda = new DockerImageFunction(
    connectStack,
    connectBackEndServerLambdaId,
    {
      code: connectBackEndServerLambdaDockerImage,
      architecture: Architecture.X86_64,
      timeout: Duration.seconds(60),
      memorySize: 1024,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL ?? "",
        CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ?? "",
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ?? "",
        PRE_SIGNED_LAMBDA_URL: process.env.PRE_SIGNED_LAMBDA_URL ?? "",
        PRE_SIGNED_LAMBDA_URL_UPLOAD_TEST:
          process.env.PRE_SIGNED_LAMBDA_URL_UPLOAD_TEST ?? "",
        STUDENT_SUBMISSION_QUEUE_URL:
          process.env.STUDENT_SUBMISSION_QUEUE_URL ?? "",
      },
    },
  );

  const connectBackEndServerApiUrlId = "connect-back-end-server-api-url";

  new LambdaRestApi(connectStack, connectBackEndServerApiUrlId, {
    handler: connectBackEndServerLambda,
  });
}
