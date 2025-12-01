import { getAuth } from "@clerk/express";
import { Classes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type FetchStudentClassesResponse = {
  statusCode: number;
  message: string;
  data: Classes[];
};

function createFetchStudentClassesResponse(
  statusCode: number,
  message: string,
  data: Classes[],
  res: Response
) {
  const response: FetchStudentClassesResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchStudentClassesQuery(
  databaseClient: PrismaClient,
  userId: string
) {
  const student = await databaseClient.users.findUnique({
    where: {
      clerkUserId: userId,
    },
    select: {
      students: {
        select: {
          studentId: true,
        },
      },
    },
  });
  const studentId = student?.students?.studentId;

  if (!studentId) {
    throw new Error("user does not have an associated student account");
  }

  const studentClasses = await databaseClient.students.findUnique({
    where: {
      studentId: studentId,
    },
    select: {
      classes: true,
    },
  });

  if (!studentClasses?.classes) {
    return [];
  }

  return studentClasses?.classes;
}

export default function fetchStudentClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully fetched student classes";
  const errorMessage = "unsuccessfully fetched student classes";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { userId } = getAuth(req);

    try {
      if (!userId) {
        logger.info("user is not authorized to access endpoint");
        createFetchStudentClassesResponse(
          StatusCodes.UNAUTHORIZED,
          errorMessage,
          [],
          res
        );
        return;
      }

      const studentClasses = await fetchStudentClassesQuery(
        databaseClient,
        userId
      );

      logger.info({ userId: userId }, successMessage);

      createFetchStudentClassesResponse(
        StatusCodes.OK,
        successMessage,
        studentClasses,
        res
      );
    } catch (error) {
      logger.error({ userId: userId, err: error }, errorMessage);

      createFetchStudentClassesResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
