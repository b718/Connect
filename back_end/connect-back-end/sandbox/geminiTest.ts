import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "fs";
import * as dotenv from "dotenv";

dotenv.config();

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
        text: `
        In this case, this is the student submission.

        Ensure these requirements are met:
        - They MUST show their work to receieve full marks.
        - If they do not explicitly highlight their answer, that is okay we do not want to deduct marks for that.
        - Please match the answers to the answer key, even if the answer key is wrong it does not matter,
          we want it to be a direct match.

        Your Job:
        - Output their grade, for example if there are seven questions and they got six right, output 6/7.
        
        Thanks!
        `,
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
        text: `
        In this case, this is the answer key.

        Your Job:
        - This is the answer key to the problem set, when marking the 'student' submissions
          please us this as reference. 
        
        Thanks!
        `,
      },
    ],
  };

  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [studentSubmission, answerKeyContent],
  });

  console.log(response.text);
}

main();
