import { clerkClient, getAuth, User } from "@clerk/express";
import { PrismaClient, Role } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

const teacherEmailAddresses = ["bryanzhao718@gmail.com"];

type AuthenticateUserResponse = {
  statusCode: number;
  message: string;
  userId: string | null;
};

export default function createNewUser(databaseClient: PrismaClient) {
  const successMessage = "successfully created user";
  const errorMessage = "unsuccessfully created user";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return createResponse(
          StatusCodes.UNAUTHORIZED,
          errorMessage,
          null,
          res,
        );
      }

      const user = await clerkClient.users.getUser(userId);
      const userRole = await createNewUserQuery(databaseClient, user);
      const updateUser = await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: userRole.userRole,
        },
      });

      logger.info(
        { firstName: user.firstName, lastName: user.lastName, role: userRole },
        successMessage,
      );

      createResponse(StatusCodes.OK, successMessage, userRole.id, res);
    } catch (error) {
      logger.info({ err: error }, errorMessage);

      createResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        null,
        res,
      );
    }
  };
}

function createResponse(
  statusCode: number,
  message: string,
  userId: string | null,
  res: Response,
) {
  const response: AuthenticateUserResponse = {
    statusCode,
    message,
    userId,
  };

  res.status(statusCode).json(response);
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

  let newCreatedUser;

  if (userRole == Role.STUDENT) {
    newCreatedUser = await createNewStudent(databaseClient, user, userRole);
  } else {
    newCreatedUser = await createNewTeacher(databaseClient, user, userRole);
  }

  return newCreatedUser;
}

function isUserTeacher(emailAddress: string) {
  return teacherEmailAddresses.includes(emailAddress);
}

async function createNewStudent(
  databaseClient: PrismaClient,
  user: User,
  userRole: Role,
) {
  const studentData = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    usersClerkUserId: user.id,
  };

  const newStudent = await databaseClient.students.upsert({
    where: {
      usersClerkUserId: user.id,
    },
    update: studentData,
    create: studentData,
  });

  return { userRole: userRole, id: newStudent.studentId };
}

async function createNewTeacher(
  databaseClient: PrismaClient,
  user: User,
  userRole: Role,
) {
  const teacherData = {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    usersClerkUserId: user.id,
  };

  const newTeacher = await databaseClient.teachers.upsert({
    where: {
      usersClerkUserId: user.id,
    },
    update: teacherData,
    create: teacherData,
  });

  return { userRole: userRole, id: newTeacher.teacherId };
}
