type GetStudentTestUploadPresignedUrl = {
  presignedUrl: string;
};

export async function getStudentTestUploadPresignedUrl(
  classId: string,
  testId: string,
  studentId: string
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
      studentId: studentId,
    }),
  });
  const response: GetStudentTestUploadPresignedUrl =
    await testUploadPresignedUrl.json();

  if (!testUploadPresignedUrl.ok) {
    throw new Error(
      "something went wrong during the upload process, please try again"
    );
  }

  return response.presignedUrl;
}
