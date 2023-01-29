import express from "express";
import loggerMiddleware from "./middlewares/logger.middleware";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware";
import userRouter from "./routes/users/users.router";
import authRouter from "./routes/auth/auth.router";

const app: express.Express = express();

const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(loggerMiddleware);

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
