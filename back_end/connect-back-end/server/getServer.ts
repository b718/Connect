import type { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { clerkMiddleware } from "@clerk/express";
import getStudentTestSubmission from "../handlers/get/student-submission/getStudentTestSubmission";
import createNewUser from "../handlers/post/create-new-user/createNewUser";
import express from "express";
import cors from "cors";
import studentRouter from "./routers/student/student.routes";
import teacherRouter from "./routers/teacher/teacher.route";
import fetchAllClasses from "../handlers/get/shared/fetch-all-classes/fetchAllClasses";

export default async function getServer(databaseClient: PrismaClient) {
  const app: Express = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(clerkMiddleware());

  // student handlers
  app.use("/student", studentRouter(databaseClient));

  // teacher handlers
  app.use("/teacher", teacherRouter(databaseClient));

  // get handlers
  app.get("/classes/all", fetchAllClasses(databaseClient));
  app.get(
    "/classes/:classId/students/:studentId/tests/:testId/submissions",
    getStudentTestSubmission(),
  );

  // post handlers
  app.post("/authenticate", createNewUser(databaseClient));

  return app;
}
