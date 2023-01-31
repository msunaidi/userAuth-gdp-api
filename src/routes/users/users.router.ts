import { Request, Response, NextFunction, Router } from "express";
import usersService from "../../services/user.service";
import HttpError from "../../models/http-error.model";
import User from "../../models/user.model";

const userRouter: Router = Router();

/**
 * A POST route to handle the submission of the form. This route will
 * create a new user in the database.
 */
userRouter.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Bad Request",
      });
    }

    const user = usersService.create({ name, email, password });

    res.json({
      user,
    });
  } catch (error) {
    throw new HttpError(500, (error as Error).message);
  }
});

/**
 * A GET route to handle the retrieval of all users in the database.
 */
userRouter.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = usersService.find();

    res.json(users);
  } catch (error) {
    throw new HttpError(500, (error as Error).message);
  }
});

/**
 * A GET route to handle the retrieval of a single user in the database.
 */
userRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  try {
    const user = usersService.findOneOrFail("id", id);

    res.json(user);
  } catch (error) {
    throw new HttpError(404, (error as Error).message);
  }
});

/**
 * A PATCH route to handle the updating of a single user in the database.
 */
userRouter.patch("/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  let user: User;

  try {
    user = usersService.findOneOrFail("id", id);
  } catch (error) {
    throw new HttpError(404, (error as Error).message);
  }

  try {
    user = usersService.update(user, { id, name, email, password });

    res.json(user);
  } catch (error) {
    throw new HttpError(400, "Unable to update user");
  }
});

/**
 * A DELETE route to handle the deletion of a single user in the database.
 */
userRouter.delete("/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  let user: User;

  try {
    user = usersService.findOneOrFail("id", id);
  } catch (error) {
    throw new HttpError(404, (error as Error).message);
  }

  try {
    usersService.delete(user);

    res.json({
      message: "Success",
    });
  } catch (error) {
    throw new HttpError(400, "Unable to delete user");
  }
});

export default userRouter;
