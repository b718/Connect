import { PrismaClient, Teachers } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pino from "pino";
import sendResponse from "../../../../utilities/sendResponse";

type Classes = {
  classId: string;
  courseName: string;
  studentGradeYear: number;
  createdAt: Date;
  teachers: Teachers[];
};

type FetchAllClassesResponse = {
  statusCode: number;
  message: string;
  data: Classes[];
};

export default function fetchAllClasses(databaseClient: PrismaClient) {
  const successMessage = "successfully queried all classes";
  const errorMessage = "unsuccessfully queried all classes";
  const logger = pino({ name: __filename });
  const response: FetchAllClassesResponse = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: errorMessage,
    data: [],
  };

  return async function (_req: Request, res: Response) {
    try {
      const classes = await fetchAllClassesQuery(databaseClient);
      logger.info({ totalClasses: classes.length }, successMessage);
      response.statusCode = StatusCodes.OK;
      response.data = classes;
    } catch (error) {
      logger.error({ err: error }, errorMessage);
    } finally {
      sendResponse<FetchAllClassesResponse>(res, response.statusCode, response);
    }
  };
}

async function fetchAllClassesQuery(databaseClient: PrismaClient) {
  const classes = await databaseClient.classes.findMany({
    include: {
      teachers: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return classes;
}
