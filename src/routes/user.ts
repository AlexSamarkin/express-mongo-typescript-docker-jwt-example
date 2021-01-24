import { Request, Response, Router } from "express";
import jwtMiddleware from "express-jwt";
import userService from "../services/user";
import config from "../config";

const userRouter = Router();

userRouter.post("/create", async (req: Request, res: Response) => {
  const { login, password } = req.body;
  const result = await userService.create(login, password);
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

export default userRouter;
