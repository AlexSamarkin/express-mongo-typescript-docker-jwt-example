import "reflect-metadata";
import express, { Express } from "express";
import initDatabase from "./db";
import authRoute from "./routes/auth";
import userRoute from "./routes/user";
import config from "./config";

const app = express();

export function initApp(): Express {
  if (config.env === "production" || config.env === "development") {
    initDatabase();
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/auth", authRoute);
  app.use("/users", userRoute);

  return app;
}

export default initApp;
