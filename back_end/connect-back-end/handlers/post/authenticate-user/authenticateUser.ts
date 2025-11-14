import { clerkClient, getAuth, User } from "@clerk/express";
import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type AuthenticateUserResponse = {
  statusCode: number;
  message: string;
  userRole: Role | null;
};

function isUserTeacher(emailAddress: string) {
  return teacherEmailAddresses.includes(emailAddress);
}

async function createNewUserQuery(databaseClient: PrismaClient, user: User) {
  const userRole = isUserTeacher(user.emailAddresses[0].emailAddress)
    ? Role.TEACHER
    : Role.STUDENT;
  const userData = {
    clerkUserId: user.id,
    email: user.emailAddresses[0].emailAddress,
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    role: userRole,
  };

  const newUser = await databaseClient.users.upsert({
    where: {
      clerkUserId: user.id,
    },
    update: userData,
    create: userData,
  });

  return newUser.role;
}

function createAuthenticateUserResponse(
  statusCode: number,
  message: string,
  userRole: Role | null,
  res: Response
) {
  const response: AuthenticateUserResponse = {
    statusCode,
    message,
    userRole,
  };

  res.status(statusCode).json(response);
}

export default function authenticateUser(databaseClient: PrismaClient) {
  const successMessage = "successfully created user";
  const errorMessage = "unsuccessfully created user";
  const logger = pino({
    name: "handlers/post/authenticate-user/authenticateUser.ts",
  });

  return async function (req: Request, res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        createAuthenticateUserResponse(
          StatusCodes.UNAUTHORIZED,
          errorMessage,
          null,
          res
        );
        return;
      }

      const user = await clerkClient.users.getUser(userId);
      const userRole = await createNewUserQuery(databaseClient, user);

      logger.info({
        firstName: user.firstName,
        lastName: user.lastName,
        role: userRole,
        message: successMessage,
      });

      createAuthenticateUserResponse(
        StatusCodes.OK,
        successMessage,
        userRole,
        res
      );
    } catch (error) {
      logger.info({
        message: errorMessage,
      });

      createAuthenticateUserResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        null,
        res
      );
    }
  };
}
