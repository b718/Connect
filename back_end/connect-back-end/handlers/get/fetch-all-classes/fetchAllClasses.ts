import { Classes, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";

type GetClassesResponse = {
  statusCode: number;
  message: string;
  data: Classes[];
};

function createGetClassesResponse(
  statusCode: number,
  message: string,
  data: Classes[],
  res: Response
) {
  const response: GetClassesResponse = {
    statusCode: statusCode,
    message: message,
    data: data,
  };

  res.status(statusCode).json(response);
}

async function fetchAllClassesQuery(databaseClient: PrismaClient) {
  const classes = await databaseClient.classes.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return classes;
}

export default function fetchAllClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully queried all classes";
  const errorMessage = "unsuccessfully queried all classes";
  const logger = pino({ name: __filename });

  return async function (_req: Request, res: Response) {
    try {
      const classes = await fetchAllClassesQuery(databaseClient);
      logger.info({ totalClasses: classes.length }, successMessage);

      createGetClassesResponse(StatusCodes.OK, successMessage, classes, res);
    } catch (error) {
      logger.error({ err: error }, errorMessage);

      createGetClassesResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        errorMessage,
        [],
        res
      );
    }
  };
}
