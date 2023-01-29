import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "http";
/**
 * A simple logger middleware that logs the request method and path.
 */
export default (req: Request, res: Response, next: NextFunction) => {
  const { method, url } = req;

  res.removeHeader("X-Powered-By");

  console.info(`${method.toUpperCase()} ${url}`);

  next();
};
