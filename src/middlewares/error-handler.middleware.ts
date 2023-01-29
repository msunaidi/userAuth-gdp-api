import { Request, Response, NextFunction } from "express";
import HttpError from "../models/http-error.model";

const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    message,
    statusCode,
  });
};

export default errorHandlerMiddleware;
