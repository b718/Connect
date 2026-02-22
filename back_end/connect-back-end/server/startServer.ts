import type { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";
import getStudentTestSubmission from "../handlers/get/student-submission/getStudentTestSubmission";
import createNewUser from "../handlers/post/create-new-user/createNewUser";
import pino from "pino";
import express from "express";
import cors from "cors";
import studentRouter from "./routers/student/student.routes";
import teacherRouter from "./routers/teacher/teacher.route";

export default async function startServer(databaseClient: PrismaClient) {
  const SERVER_PORT = process.env.SERVER_PORT || 3003;
  const app: Express = express();
  const logger = pino({ name: __filename });

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(clerkMiddleware());

  // student handlers
  app.use("/student", studentRouter(databaseClient));

  // teacher handlers
  app.use("/teacher", teacherRouter(databaseClient));

  // get handlers
  app.get(
    "/classes/:classId/students/:studentId/tests/:testId/submissions",
    getStudentTestSubmission(),
  );

  // post handlers
  app.post("/authenticate", createNewUser(databaseClient));

  app.listen(SERVER_PORT, () => {
    logger.info(`starting server at port: ${SERVER_PORT}`);
  });
}
