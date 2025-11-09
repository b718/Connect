export default async function getAnswerKeyUrl(classId: string, testId: string) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL!;
  const fetchedAnswerKey = await fetch(presignedLambdaUrl!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: classId,
      testId: testId,
    }),
  });

  if (!fetchedAnswerKey.ok) {
    const response = await fetchedAnswerKey.json();
    throw new Error(
      `unable to fetch test with error '${response.message}' and reason '${response.Reason}`
    );
  }

  const response = await fetchedAnswerKey.json();

  return response.presignedUrl;
}
