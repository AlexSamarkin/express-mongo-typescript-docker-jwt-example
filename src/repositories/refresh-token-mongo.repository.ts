import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshToken } from "../models/domain";
import { RefreshTokenModel } from "../models/mongo/refreshToken";

export class RefreshTokenMongoRepository implements RefreshTokenRepository {
  async create(refreshToken: string, id: string): Promise<RefreshToken> {
    const result = await RefreshTokenModel.create({
      refreshToken,
      user: id,
    });

    return {
      refreshToken: result.refreshToken,
      userLogin: result.user.login,
    };
  }

  async find(token: string): Promise<RefreshToken | null> {
    const result = await RefreshTokenModel.findOne({
      refreshToken: token,
    })
      .populate("user")
      .exec();

    if (!result) {
      return null;
    }

    return {
      refreshToken: result.refreshToken,
      userLogin: result.user.login,
    };
  }

  async findOneAndRemove(refreshToken: string): Promise<void> {
    await RefreshTokenModel.findOneAndRemove({ refreshToken });
  }

  async removeByUser(userId: string): Promise<boolean> {
    const result = await RefreshTokenModel.remove({ user: userId });
    return !!result;
  }

  async findByUser(userId: string): Promise<RefreshToken[]> {
    const collection = await RefreshTokenModel.find({ user: userId })
      .populate("user")
      .exec();
    return collection.map(({ refreshToken, user }) => {
      return {
        refreshToken,
        userLogin: user.login,
      };
    });
  }

  async all(): Promise<RefreshToken[]> {
    const collection = await RefreshTokenModel.find().populate("user").exec();
    return collection.map(({ refreshToken, user }) => {
      return {
        refreshToken,
        userLogin: user.login,
      };
    });
  }
}

export default new RefreshTokenMongoRepository();
