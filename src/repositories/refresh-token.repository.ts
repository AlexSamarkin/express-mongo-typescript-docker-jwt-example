import { RefreshToken } from "../models/refresh-token";

export interface RefreshTokenRepository {
  find(token: string): Promise<RefreshToken | null>;
  create(refreshToken: string, userId: string): Promise<RefreshToken>;
  findOneAndRemove(refreshToken: string): Promise<void>;
  removeByUser(userId: string): Promise<boolean>;
  findByUser(userId: string): Promise<RefreshToken[]>;
  all(): Promise<RefreshToken[]>;
}
