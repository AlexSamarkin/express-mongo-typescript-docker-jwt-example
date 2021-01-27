import { v4 } from "uuid";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh-token";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import userService, { IUserService } from "./user.service";
import refreshTokenMongoRepository from "../repositories/refresh-token-mongo.repository";
import { RefreshTokenNotFoundException } from "../exceptions/refresh-token-not-found.exception";
import { RefreshTokenCreateException } from "../exceptions/refresh-token-create.exception";

export interface IRefreshTokenService {
  find(refreshToken: string): Promise<RefreshToken>;
  findByUser(login: string): Promise<RefreshToken[]>;
  create(login: string): Promise<RefreshToken>;
  removeByUser(login: string): Promise<void>;
  remove(refreshToken: string): Promise<boolean>;
  all(): Promise<RefreshToken[]>;
}

export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly userService: IUserService
  ) {}

  async create(login: string): Promise<RefreshToken> {
    try {
      const user: User = await this.userService.find(login);
      const { refreshToken } = await this.repository.create(v4(), user.id);
      return new RefreshToken(refreshToken, user.login);
    } catch (e) {
      throw new RefreshTokenCreateException();
    }
  }

  async remove(refreshToken: string): Promise<boolean> {
    try {
      await this.repository.findOneAndRemove(refreshToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeByUser(login: string): Promise<void> {
    try {
      const user = await this.userService.find(login);
      await this.repository.removeByUser(user.id);
    } catch (e) {
      return;
    }
  }

  async find(refreshToken: string): Promise<RefreshToken> {
    const result = await this.repository.find(refreshToken);
    if (!result) {
      throw new RefreshTokenNotFoundException();
    }
    return result;
  }

  async findByUser(login: string): Promise<RefreshToken[]> {
    try {
      const user = await this.userService.find(login);
      return await this.repository.findByUser(user.id);
    } catch (e) {
      return [];
    }
  }

  async all(): Promise<RefreshToken[]> {
    return await this.repository.all();
  }
}

export default new RefreshTokenService(
  refreshTokenMongoRepository,
  userService
);
