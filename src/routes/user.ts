import "reflect-metadata";
import { Request, Response, Router } from "express";
import jwtMiddleware from "express-jwt";
import config from "../config";
import { CreateUserDto } from "../dto/create-user-dto";
import jwt from "jsonwebtoken";
import { diContainer } from "../di/container";
import { IUserService } from "../services/user.service";
import { TYPES } from "../di/types";
import { Login } from "../value-objects/login";

const userService: IUserService = diContainer.get<IUserService>(
  TYPES.UserService
);

const userRouter = Router();

userRouter.post("/create", async (req: Request, res: Response) => {
  const { login, email, password } = req.body;
  const createUser = new CreateUserDto(login, email, password);
  const result = await userService.create(createUser);
  res.send({
    result: { login: result.login.value, email: result.email.value },
  });
});

userRouter.get(
  "/all",
  jwtMiddleware({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
  }),
  async (req: Request, res: Response) => {
    const users = await userService.all();
    const responseUsers = users.map((user) => ({
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
