export default async function getStudentSubmissionUrl(
  classId: string,
  studentId: string,
  testId: string
) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL!;
  const fetchedStudentSubmission = await fetch(presignedLambdaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: classId,
      studentId: studentId,
      testId: testId,
    }),
  });

  if (!fetchedStudentSubmission.ok) {
    const response = await fetchedStudentSubmission.json();
    throw new Error(
      `unable to fetch test with error '${response.message}' and reason '${response.Reason}`
    );
  }

  const response = await fetchedStudentSubmission.json();

  return { presignedUrl: response.presignedUrl };
}
