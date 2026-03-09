import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import path from "path";
import { Logger } from "pino";

type GradedTest = {
  grade: number;
  confident: boolean;
  reasoning: string;
};

const studentSubmissionInstruction = fs.readFileSync(
  path.join(__dirname, "../llm-instructions/student-submission.txt"),
  "utf-8",
);

const answerKeyInstruction = fs.readFileSync(
  path.join(__dirname, "../llm-instructions/answer-key.txt"),
  "utf-8",
);

async function encodeSubmission(submissionUrl: string): Promise<string> {
  const fetchedSubmission = await fetch(submissionUrl);
  if (!fetchedSubmission.ok) {
    throw new Error(
      `Failed to fetch submission from ${submissionUrl}, status: ${fetchedSubmission.status}`,
    );
  }
  const arrayBuffer = await fetchedSubmission.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

async function fetchEncodedSubmissions(
  classId: string,
  studentId: string,
  testId: string,
  logger: Logger,
) {
  const presignedLambdaUrl = process.env.PRE_SIGNED_LAMBDA_URL!;
  const fetchAnswerKey = fetch(presignedLambdaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      classId: classId,
      testId: testId,
    }),
  });
  const fetchStudentSubmission = fetch(presignedLambdaUrl, {
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

  const [answerKeyResponse, studentSubmissionResponse] = await Promise.all([
    fetchAnswerKey,
    fetchStudentSubmission,
  ]);

  logger.info(
    {
      answerKeyResponseOk: answerKeyResponse.ok,
      studentSubmissionResponseOk: studentSubmissionResponse.ok,
    },
    "presigned url responses",
  );

  if (!answerKeyResponse.ok) {
    throw new Error("Failed to answer key file");
  }

  if (!studentSubmissionResponse.ok) {
    throw new Error("Failed to student submission file");
  }

  const [answerKey, studentSubmission] = await Promise.all(
    [answerKeyResponse, studentSubmissionResponse].map(async (response) => {
      const presignedUrl = await response.json();
      const encodedSubmission = encodeSubmission(presignedUrl.presignedUrl);
      return encodedSubmission;
    }),
  );

  return [answerKey, studentSubmission];
}

function createAnswerKeyRequest(encodedAnswerKey: string) {
  const answerKey = {
    parts: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: encodedAnswerKey,
        },
      },
      {
        text: answerKeyInstruction,
      },
    ],
  };

  return answerKey;
}

function createStudentSubmissionRequest(encodedStudentSubmission: string) {
  const studentSubmission = {
    parts: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: encodedStudentSubmission,
        },
      },
      {
        text: studentSubmissionInstruction,
      },
    ],
  };

  return studentSubmission;
}

export async function gradeTest(
  geminiClient: GoogleGenAI,
  classId: string,
  studentId: string,
  testId: string,
  logger: Logger,
) {
  logger.info({
    studentId: studentId,
    testId: testId,
    classId: classId,
    message: "grading test for student",
  });
  const [encodedAnswerKey, encodedStudentSubmission] =
    await fetchEncodedSubmissions(classId, studentId, testId, logger);

  const response = await geminiClient.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      createAnswerKeyRequest(encodedAnswerKey),
      createStudentSubmissionRequest(encodedStudentSubmission),
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          grade: { type: "NUMBER" },
          confident: { type: "BOOLEAN" },
          reasoning: { type: "STRING" },
        },
        required: ["grade", "confident", "reasoning"],
      },
    },
  });

  if (!response.text) {
    logger.error({
      studentId: studentId,
      testId: testId,
      classId: classId,
      message: "unsuccessfully graded test for student",
    });
    throw new Error("an error occured while trying to grade the test");
  }

  const gradedTest: GradedTest = JSON.parse(response.text);
  logger.info({ response: response.text }, "llm response");
  logger.info(
    {
      studentId: studentId,
      testId: testId,
      classId: classId,
      grade: `${gradedTest.grade.toFixed(2)}%`,
      confident: gradedTest.confident,
    },
    "successfully graded test for student",
  );

  return gradedTest;
}
