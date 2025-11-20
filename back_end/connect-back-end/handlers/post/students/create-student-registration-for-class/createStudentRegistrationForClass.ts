import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export default function createStudentRegistrationForClass(
  databaseClient: PrismaClient
) {
  return async function (req: Request, res: Response) {};
}
