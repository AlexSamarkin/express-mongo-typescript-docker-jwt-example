import { RefreshTokenRepository } from "../../repositories/refresh-token.repository";
import { RefreshToken } from "../../models/domain";
import tokens from "../fixtures/refresh-tokens";
import users from "../fixtures/users";

export class RefreshTokenRepositoryMock implements RefreshTokenRepository {
  constructor(private tokens: RefreshToken[]) {}
  async all(): Promise<RefreshToken[]> {
    return Promise.resolve(this.tokens);
  }

  async create(refreshToken: string, userId: string): Promise<RefreshToken> {
    const user = users.find((userFixture) => userFixture.id === userId);
    if (!user) {
      throw new Error();
    }
    const token = {
      userLogin: user.login,
      refreshToken,
    };

    tokens.push(token);
    return Promise.resolve(token);
  }

  async find(token: string): Promise<RefreshToken | null> {
    const found = tokens.find(({ refreshToken }) => refreshToken === token);
    return Promise.resolve(found || null);
  }

  async findByUser(userId: string): Promise<RefreshToken[]> {
    const user = users.find((userFixture) => userFixture.id === userId);
    if (!user) {
      throw new Error();
    }
    const found = tokens.filter(({ userLogin }) => userLogin === user.login);
    return Promise.resolve(found);
  }

  async findOneAndRemove(refreshToken: string): Promise<void> {
    this.tokens = this.tokens.filter(
      (token) => token.refreshToken !== refreshToken
    );
    return Promise.resolve();
  }

  async removeByUser(login: string): Promise<boolean> {
    this.tokens = this.tokens.filter((token) => token.userLogin !== login);
    return Promise.resolve(true);
  }
}

export default new RefreshTokenRepositoryMock(tokens);
