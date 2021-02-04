import "reflect-metadata";
import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtMiddleware from "express-jwt";
import config from "../config";
import { CreateUserDto } from "../dto/create-user-dto";
import { diContainer } from "../di/container";
import { TYPES } from "../di/types";
import { IUserService } from "../services/user.service";
import { IRefreshTokenService } from "../services/refresh-token.service";
import { Login } from "../value-objects/login";

const authRouter = Router();

const userService: IUserService = diContainer.get<IUserService>(
  TYPES.UserService
);

const refreshTokenService: IRefreshTokenService = diContainer.get<IRefreshTokenService>(
  TYPES.RefreshTokenService
);

authRouter.post("/login", async (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = await userService.find(new Login(login));
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordMatch) {
    res.status(401).end();
    return;
  }

  const token = await jwt.sign(
    {
      login: user.login.value,
      email: user.email.value,
    },
    config.jwtSecret,
    {
      expiresIn: config.jwtExpiresIn,
      algorithm: config.jwtAlgorithm,
    }
  );
  const { refreshToken } = await refreshTokenService.create(login);

  res.send({
    token,
    refreshToken,
  });
});

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken, accessToken } = req.body;
  const { login } = (await jwt.decode(accessToken)) as { login: string };

  try {
    const existingToken = await refreshTokenService.find(refreshToken);
    await refreshTokenService.remove(existingToken.refreshToken);

    const token = await jwt.sign({ login }, config.jwtSecret);
    const newRefreshToken = await refreshTokenService.create(login);

    res.send({
      token,
      refreshToken: newRefreshToken.refreshToken,
    });
  } catch (e) {
    res.status(403).end();
  }
});

authRouter.post("/register", async (req: Request, res: Response) => {
  const { login, email, password } = req.body;
  if (!login || !password || !email) {
    res.status(403).end();
    return;
  }

  try {
    const dto = new CreateUserDto(login, email, password);
    const user = await userService.create(dto);
    res.send({
      status: "success",
      user: {
        login: user.login.value,
        email: user.email.value,
      },
    });
  } catch (e) {
    res.send({ status: "error", message: "Unable to create user" });
  }
});

authRouter.post(
  "/logout",
  jwtMiddleware({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
  }),
  async (req: Request, res: Response) => {
    const { login } = req.body;
    const result = await refreshTokenService.removeByUser(login);
    res.send({
      status: result,
    });
  }
);

export default authRouter;
