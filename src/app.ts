import express, { Express } from "express";
import initDatabase from "./db";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";

const app = express();

function initApp(): Express {
  initDatabase();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/auth", authRoute);
  app.use("/users", userRoute);

  return app;
}

export default initApp;
