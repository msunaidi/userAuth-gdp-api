// TODO: Create a route that will do the following:
// 1. Handle a POST request to /auth/login that will take in an email and password as the request body
//      and will return a JSON object with a token property. This token SHOULD be stored in the database.
// 2. Handle a POST request to /auth/profile that will take in a token in the request header with key Authentication.
//      Our clients should send the token in the following format: "Bearer <token>". for example:
//      "Bearer 1234567890". If the token is valid, then return a JSON object with the user's profile.

import { Request, Response, NextFunction, Router } from "express";
import HttpError from "../../models/http-error.model";
import authService from "../../services/auth.service";

const authRouter: Router = Router();

authRouter.post("/login", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const token = authService.verifyUser(email, password);
    res.json(token);
  } catch (error) {
    throw new HttpError(500, (error as Error).message);
  }
});

authRouter.post(
  "/profile",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authzHeader = req.headers.authorization;
      const token = authzHeader!.split(" ")[1];
      const user = authService.getUser(token);
      res.json(user);
    } catch (error) {
      throw new HttpError(500, (error as Error).message);
    }
  }
);

export default authRouter;
