import type { Express } from "express";
import { PrismaClient } from "@prisma/client";
import pino from "pino";
import express from "express";
import cors from "cors";
import getStudentGradesForTest from "../handlers/get/student-grades-for-test/getStudentGradesForTest";
import getAllStudentGradesForClass from "../handlers/get/all-student-grades-for-class/getAllStudentGradesForClass";
import getClassInformation from "../handlers/get/class-information/getClassInformation";
import getClasses from "../handlers/get/classes/getClasses";
import createTestForClass from "../handlers/post/create-test-for-class/createTestForClass";
import studentTestUploadPresignedUrl from "../handlers/get/student-test-upload-presigned-url/studentTestUploadPresignedUrl";
import publishStudentSubmissionEvent from "../handlers/post/mark-test-for-class/publish/publishStudentSubmissionEvent";

export default async function startServer(databaseClient: PrismaClient) {
  const logger = pino({
    name: "connected-back-end/index.ts",
  });

  const app: Express = express();
  app.use(cors());
  app.use(express.json());

  const SERVER_PORT = process.env.SERVER_PORT || 3003;

  // get handlers
  app.get("/classes", getClasses(databaseClient));
  app.get("/classes/:classId", getClassInformation(databaseClient));
  app.get(
    "/classes/:classId/grades",
    getAllStudentGradesForClass(databaseClient)
  );
  app.get(
    "/classes/:classId/grades/tests/:testId",
    getStudentGradesForTest(databaseClient)
  );
  app.get(
    "/classes/:classId/students/:studentId/tests/:testId/grade",
    studentTestUploadPresignedUrl()
  );

  // post handlers
  app.post(
    "/classes/:classId/tests/create",
    createTestForClass(databaseClient)
  );
  app.post(
    "/classes/:classId/students/:studentId/tests/:testId/grade",
    publishStudentSubmissionEvent()
  );

  app.listen(SERVER_PORT, () => {
    logger.info(`starting server at port: ${SERVER_PORT}`);
  });
}
