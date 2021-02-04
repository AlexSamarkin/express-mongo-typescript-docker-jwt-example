import "reflect-metadata";
import { injectable } from "inversify";
import { RefreshTokenRepository } from "../../../repositories/refresh-token.repository";
import { RefreshToken } from "../../../models/refresh-token";
import tokensFixture from "../../fixtures/refresh-tokens";
import usersFixtures from "../../fixtures/users";
import { User } from "../../../models/user";
import { Login } from "../../../value-objects/login";
import { Email } from "../../../value-objects/email";

@injectable()
export class RefreshTokenTestRepository implements RefreshTokenRepository {
  private tokens: RefreshToken[];
  private readonly users: User[];
  constructor() {
    this.tokens = tokensFixture.map(
      ({ refreshToken, userId }) => new RefreshToken(refreshToken, userId)
    );
    this.users = usersFixtures.map(
      ({ id, login, email, password }) =>
        new User(id, new Login(login), new Email(email), password)
    );
  }
  async all(): Promise<RefreshToken[]> {
    return Promise.resolve(this.tokens);
  }

  async create(refreshToken: string, userId: string): Promise<RefreshToken> {
    const user = this.users.find((userFixture) => userFixture.id === userId);
    if (!user) {
      throw new Error();
    }
    const token = new RefreshToken(refreshToken, user.id);

    this.tokens.push(token);
    return Promise.resolve(token);
  }

  async find(token: string): Promise<RefreshToken | null> {
    const found = this.tokens.find(
      (refreshToken) => refreshToken.refreshToken === token
    );
    if (!found) {
      return Promise.resolve(null);
    }

    return Promise.resolve(found);
  }

  async findByUser(userId: string): Promise<RefreshToken[]> {
    const user = this.users.find((userFixture) => userFixture.id === userId);
    if (!user) {
      throw new Error();
    }
    const found = this.tokens.filter((token) => token.userId === user.id);

    return Promise.resolve(found);
  }

  async findOneAndRemove(refreshToken: string): Promise<void> {
    this.tokens = this.tokens.filter(
      (token) => token.refreshToken !== refreshToken
    );
    return Promise.resolve();
  }

  async removeByUser(userId: string): Promise<boolean> {
    this.tokens = this.tokens.filter((token) => token.userId !== userId);
    return Promise.resolve(true);
  }
}
