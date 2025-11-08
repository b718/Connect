import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import path from "path";
import { Logger } from "pino";

type MarkedTest = {
  grade: number;
  confident: boolean;
  reasoning?: string;
};

const studentSubmissionInstruction = fs.readFileSync(
  path.join(__dirname, "llm-instructions/student-submission.txt"),
  "utf-8"
);

const answerKeyInstruction = fs.readFileSync(
  path.join(__dirname, "llm-instructions/answer-key.txt"),
  "utf-8"
);

async function encodeSubmission(submissionUrl: string) {
  const fetchedSubmission = await fetch(submissionUrl);
  const arrayBuffer = await fetchedSubmission.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

async function fetchEncodedSubmissions(
  classId: string,
  studentId: string,
  testId: string
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

  return Promise.all(
    [fetchAnswerKey, fetchStudentSubmission].map(async (request) => {
      const response = await request;
      const presignedUrl = await response.json();
      const encodedSubmission = await encodeSubmission(
        presignedUrl.presignedUrl
      );

      return encodedSubmission;
    })
  );
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
  logger: Logger
) {
  logger.info({
    studentId: studentId,
    testId: testId,
    classId: classId,
    message: "grading test for student",
  });
  const encodedSubmissions = await fetchEncodedSubmissions(
    classId,
    studentId,
    testId
  );
  const encodedAnswerKey = encodedSubmissions[0];
  const encodedStudentSubmission = encodedSubmissions[1];

  const response = await geminiClient.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      createAnswerKeyRequest(encodedAnswerKey),
      createStudentSubmissionRequest(encodedStudentSubmission),
    ],
    config: {
      responseMimeType: "application/json",
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

  const markedTest: MarkedTest = JSON.parse(response.text);
  logger.info({
    studentId: studentId,
    testId: testId,
    classId: classId,
    grade: `${markedTest.grade.toFixed(2)}%`,
    confident: markedTest.confident,
    message: "successfully graded test for student",
  });
  return markedTest;
}
