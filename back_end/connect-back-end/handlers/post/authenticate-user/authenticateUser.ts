import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import pino from "pino";

type AuthenticateUserRequest = {
  email: string;
  password: string;
};

export default function authenticateUser(databaseClient: PrismaClient) {
  const logger = pino({
    name: "handlers/post/authenticate-user/authenticateUser.ts",
  });

  return async function (req: Request, res: Response) {
    const data: AuthenticateUserRequest = req.body;

    try {
    } catch (error) {}
  };
}
