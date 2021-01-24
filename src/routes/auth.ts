import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import jwtMiddleware from "express-jwt";
import userService from "../services/user";
import refreshTokenService from "../services/refreshToken";
import config from "../config";

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { login, password } = req.body;

  const user = await userService.find(login);
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!user || !isPasswordMatch) {
    res.status(401).end();
  }

  const token = await jwt.sign({ login }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
    algorithm: config.jwtAlgorithm,
  });
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