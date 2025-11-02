type FetchTestResponse = {
  presignedUrl: string;
};

export default async function getViewTestUrl(classId: string, testId: string) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL!;
  const fetchedTest = await fetch(presignedLambdaUrl!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: classId,
      testId: testId,
    }),
  });

  if (!fetchedTest.ok) {
    throw new Error("unable to fetch test, please try again");
  }

  const response: FetchTestResponse = await fetchedTest.json();

  return response.presignedUrl;
}
