import "reflect-metadata";
import { Request, Response, Router } from "express";
import jwtMiddleware from "express-jwt";
import config from "../config";
import jwt from "jsonwebtoken";
import { diContainer } from "../di/container";
import { IUserService } from "../services/user.service";
import { TYPES } from "../di/types";
import { Login } from "../value-objects/login";
import { User } from "../models/user";

const userService: IUserService = diContainer.get<IUserService>(
  TYPES.UserService
);

const userRouter = Router();

userRouter.get(
  "/all",
  jwtMiddleware({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
  }),
  async (req: Request, res: Response) => {
    const users = await userService.all();
    const responseUsers = users.map((user: User) => ({
      login: user.login.value,
      email: user.email.value,
    }));
    res.send({ users: responseUsers });
  }
);

userRouter.get(
  "/whoami",
  jwtMiddleware({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
  }),
  async (req: Request, res: Response) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    const { login } = <{ login: string }>jwt.decode(<string>token);
    const user = await userService.find(new Login(login));
    res.send({ me: { login: user.login.value, email: user.email.value } });
  }
);

export default userRouter;
