import { Request, Response, Router } from "express";
import jwtMiddleware from "express-jwt";
import userService from "../services/user.service";
import config from "../config";
import { CreateUserDto } from "../dto/create-user-dto";
import jwt from "jsonwebtoken";

const userRouter = Router();

userRouter.post("/create", async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const createUser = new CreateUserDto(login, password);
  const result = await userService.create(createUser);
  res.send({ result });
});

userRouter.get(
  "/all",
  jwtMiddleware({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
  }),
  async (req: Request, res: Response) => {
    const users = await userService.all();
    res.send({ users });
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
    const user = await userService.find(login);
    res.send({ me: user });
  }
);

export default userRouter;
