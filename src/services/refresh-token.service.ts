import { v4 } from "uuid";
import { RefreshToken, User } from "../models/domain";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import userService, { IUserService } from "./user";
import refreshTokenMongoRepository from "../repositories/refresh-token-mongo.repository";

export interface IRefreshTokenService {
  find(refreshToken: string): Promise<RefreshToken>;
  findByUser(login: string): Promise<RefreshToken[]>;
  create(login: string, password: string): Promise<RefreshToken>;
  removeByUser(login: string): Promise<boolean>;
  remove(refreshToken: string): Promise<boolean>;
}

class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly userService: IUserService
  ) {}

  async create(login: string): Promise<RefreshToken> {
    const user: User = await this.userService.find(login);
    const { refreshToken } = await this.repository.create(v4(), user.id);
    return {
      refreshToken,
      userLogin: user.login,
    };
  }

  async remove(refreshToken: string): Promise<boolean> {
    try {
      await this.repository.findOneAndRemove(refreshToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeByUser(login: string): Promise<boolean> {
    try {
      const user = await this.userService.find(login);
      if (!user) {
        return false;
      }
      await this.repository.removeByUser(user.id);
      return true;
    } catch (e) {
      return false;
    }
  }

  async find(refreshToken: string): Promise<RefreshToken> {
    const result = await this.repository.find(refreshToken);
    if (!result) {
      throw new Error("Token not found");
    }
    return result;
  }

  async findByUser(login: string): Promise<RefreshToken[]> {
    const user = await this.userService.find(login);
    if (!user) {
      throw new Error("No user found");
    }

    return await this.repository.findByUser(user.id);
  }
}

export default new RefreshTokenService(
  refreshTokenMongoRepository,
  userService
);
