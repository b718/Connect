import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import pino from "pino";

type PostMarkTestForClassRequest = {
  testId: string;
  studentId: string;
};

export default function postMarkTestForClass(databaseClient: PrismaClient) {
  const successMessage = "successfully marked test for student";
  const errorMessage = "unsuccessfully marked test for student";
  const logger = pino({
    name: "handlers/post-mark-test-for-class/postMarkTestForClass.ts",
  });

  return async function (req: Request, res: Response) {
    const classId = req.params.classId;
    const data: PostMarkTestForClassRequest = req.body;
  };
}
