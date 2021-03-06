import "reflect-metadata";
import { RefreshTokenRepository } from "./refresh-token.repository";
import { RefreshToken } from "../models/refresh-token";
import { RefreshTokenModel } from "../models/mongo/refreshToken";
import { injectable } from "inversify";

@injectable()
export class RefreshTokenMongoRepository implements RefreshTokenRepository {
  async create(refreshToken: string, id: string): Promise<RefreshToken> {
    const result = await RefreshTokenModel.create({
      refreshToken,
      user: id,
    });

    return new RefreshToken(result.refreshToken, result.user._id);
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

    return new RefreshToken(result.refreshToken, result.user._id);
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
    return collection.map(
      ({ refreshToken, user }) => new RefreshToken(refreshToken, user._id)
    );
  }

  async all(): Promise<RefreshToken[]> {
    const collection = await RefreshTokenModel.find().populate("user").exec();
    return collection.map(
      ({ refreshToken, user }) => new RefreshToken(refreshToken, user._id)
    );
  }
}
