import { v4 } from "uuid";
import { RefreshTokenModel } from "../models/refreshToken";
import { Model } from "mongoose";
import { RefreshToken } from "../models/types";
import { UserModel } from "../models/user";

export interface IRefreshTokenService {
  find(refreshToken: string): Promise<RefreshToken>;
  findByUser(login: string): Promise<RefreshToken[]>;
  create(login: string, password: string): Promise<RefreshToken>;
  removeByUser(login: string): Promise<boolean>;
  remove(refreshToken: string): Promise<boolean>;
}

class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private readonly repository: Model<any>,
    private readonly userRepository: Model<any>
  ) {}

  async create(login: string): Promise<RefreshToken> {
    const user = await this.userRepository.findOne({ login });
    const { refreshToken } = await this.repository.create({
      refreshToken: v4(),
      user,
    });
    return {
      refreshToken,
      userLogin: user.login,
    };
  }

  async remove(refreshToken: string): Promise<boolean> {
    try {
      await this.repository.findOneAndRemove({ refreshToken });
      return true;
    } catch (e) {
      return false;
    }
  }

  async removeByUser(login: string): Promise<boolean> {
    try {
      const user = await this.userRepository.find({ login });
      if (!user) {
        return false;
      }
      await this.repository.deleteMany({ user });
      return true;
    } catch (e) {
      return false;
    }
  }

  async find(refreshToken: string): Promise<RefreshToken> {
    const result = await this.repository.findOne({ refreshToken });
    if (!result) {
      throw new Error("Token not found");
    }
    return {
      refreshToken: result.refreshToken,
      userLogin: result.user.login,
    };
  }

  async findByUser(login: string): Promise<RefreshToken[]> {
    const user = await this.userRepository.find({ login });
    if (!user) {
      throw new Error("No user found");
    }

    const result = await this.repository.find({ user });
    return result.map(({ refreshToken, user }) => {
      return {
        refreshToken,
        userLogin: user.login,
      };
    });
  }
}

export default new RefreshTokenService(RefreshTokenModel, UserModel);
