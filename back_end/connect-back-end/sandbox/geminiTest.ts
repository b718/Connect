import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

dotenv.config();

const studentSubmissionInstruction = fs.readFileSync(
  path.join(__dirname, "llm-instructions/student-submission.txt"),
  "utf-8"
);

const answerKeyInstruction = fs.readFileSync(
  path.join(__dirname, "llm-instructions/answer-key.txt"),
  "utf-8"
);

const gemini = new GoogleGenAI({});
const base64ImageFile = readFileSync("./homework_sample.jpg", {
  encoding: "base64",
});

async function createCache() {
  const answerKeyContent = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
  ];

  const cache = await gemini.caches.create({
    model: "gemini-2.5-flash",
    config: {
      contents: answerKeyContent,
      systemInstruction:
        "This is the answer key, please refer to this when marking the student homework",
    },
  });

  return cache;
}

async function main() {
  console.log("key", process.env.GEMINI_API_KEY);

  const studentSubmission = {
    parts: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: studentSubmissionInstruction,
      },
    ],
  };

  const answerKeyContent = {
    parts: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: answerKeyInstruction,
      },
    ],
  };

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [studentSubmission, answerKeyContent],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          grade: { type: "NUMBER" },
          confident: { type: "BOOLEAN" },
          reasoning: { type: "STRING" },
        },
        required: ["grade", "confident"],
      },
    },
  });

  console.log(response.text);
}

main();
