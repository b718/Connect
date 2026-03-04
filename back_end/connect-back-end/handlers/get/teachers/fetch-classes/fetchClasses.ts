import { getAuth } from "@clerk/express";
import { Classes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import sendResponse from "../../../../utilities/sendResponse";

type FetchClassesResponse = {
  statusCode: number;
  message: string;
  data: Classes[];
};

export default function fetchClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully queried all teacher's classes";
  const errorMessage = "unsuccessfully queried all teacher's classes";
  const logger = pino({ name: __filename });

  return async function (req: Request, res: Response) {
    const { userId } = getAuth(req);
    const { teacherId } = req.params;
    const response: FetchClassesResponse = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: errorMessage,
      data: [],
    };

    try {
      if (!userId) {
        logger.info(
          { teacherId: teacherId },
          "user is not authorized to access endpoint",
        );
        response.statusCode = StatusCodes.UNAUTHORIZED;
        return sendResponse<FetchClassesResponse>(
          res,
          response.statusCode,
          response,
        );
      }

      const classes = await fetchClassesQuery(databaseClient, teacherId);
      response.statusCode = StatusCodes.OK;
      response.message = successMessage;
      response.data = classes;
      logger.info(
        { teacherId: teacherId, totalClasses: classes.length },
        successMessage,
      );
    } catch (error) {
      logger.error({ teacherId: teacherId, err: error }, errorMessage);
    } finally {
      sendResponse<FetchClassesResponse>(res, response.statusCode, response);
    }
  };
}

async function fetchClassesQuery(
  databaseClient: PrismaClient,
  teacherId: string,
) {
  const classes = await databaseClient.classes.findMany({
    where: { teachers: { some: { teacherId: { equals: teacherId } } } },
  });
  return classes;
}
