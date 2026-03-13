import getServerUrl from "../../../../../../../utilities/fetchApiUrl";

export type Tests = {
  testId: string;
  testName: string;
  classesTableId: string;
  answerKeyUrl: string;
  createdAt: Date;
};

type FetchTests = {
  statusCode: number;
  message: string;
  data: Tests[];
};

export async function fetchTests(classId: string) {
  const serverUrl = getServerUrl();
  const fetchedTests = await fetch(
    serverUrl + `/teacher/classes/${classId}/tests`,
  );

  if (!fetchedTests.ok) {
    throw Error(
      `unable to fetch tests, please try again: ${fetchedTests.statusText}`,
    );
  }

  let response: FetchTests;
  try {
    response = await fetchedTests.json();
  } catch (error) {
    throw Error("unable to fetch class, please try again");
  }

  return response.data;
}
