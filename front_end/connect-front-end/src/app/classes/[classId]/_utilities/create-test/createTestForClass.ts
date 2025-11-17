import getServerUrl from "../../../../../../utilities/fetchApiUrl";

type CreatedTest = {
  statusCode: number;
  testId: string;
  presignedUrl: string;
  message: string;
};

export async function createTestForClass(classId: string, testName: string) {
  const serverUrl = getServerUrl();
  const createdTest = await fetch(
    serverUrl + "/classes/" + classId + "/tests/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        testName: testName,
      }),
    }
  );

  if (!createdTest.ok) {
    throw new Error("unable to create test, please try again");
  }

  const response: CreatedTest = await createdTest.json();
  return { testId: response.testId, presignedUrl: response.presignedUrl };
}
