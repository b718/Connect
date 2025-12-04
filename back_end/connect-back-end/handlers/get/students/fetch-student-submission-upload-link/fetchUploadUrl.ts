type FetchUploadLinkResponse = {
  presignedUrl: string;
};

export async function fetchUploadUrl(
  classId: string,
  testId: string,
  studentId: string
) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL_UPLOAD_TEST;
  const uploadPresignedUrl = await fetch(presignedLambdaUrl!, {
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

  if (!uploadPresignedUrl.ok) {
    throw new Error(
      "something went wrong during the upload process, please try again"
    );
  }

  const response: FetchUploadLinkResponse = await uploadPresignedUrl.json();
  return response.presignedUrl;
}
