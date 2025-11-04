type GetTestUploadPresignedUrlProps = {
  presignedUrl: string;
};

export async function getTestUploadPresignedUrl(
  classId: string,
  testId: string
) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL_UPLOAD_TEST;
  const testUploadPresignedUrl = await fetch(presignedLambdaUrl!, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: classId,
      testId: testId,
    }),
  });
  const response: GetTestUploadPresignedUrlProps =
    await testUploadPresignedUrl.json();

  if (!testUploadPresignedUrl.ok) {
    throw new Error(
      "something went wrong during the upload process, please try again"
    );
  }

  return response.presignedUrl;
}
