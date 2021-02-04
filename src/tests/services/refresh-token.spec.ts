import { RefreshTokenRepositoryMock } from "../mocks/refresh-token-repository.mock";
import { UserServiceMock } from "../mocks/user-service.mock";
import { UserRepositoryMock } from "../mocks/user-repository.mock";
import tokensFixture from "../fixtures/refresh-tokens";
import {
  RefreshTokenService,
  IRefreshTokenService,
} from "../../services/refresh-token.service";
import { RefreshToken } from "../../models/refresh-token";
import usersFixtures from "../fixtures/users";
import { User } from "../../models/user";
import { Login } from "../../value-objects/login";
import { Email } from "../../value-objects/email";

let service: IRefreshTokenService;
let tokens: RefreshToken[];
let users: User[];

describe("RefreshTokenService", () => {
  beforeEach(() => {
    tokens = tokensFixture.map(
      ({ refreshToken, userId }) => new RefreshToken(refreshToken, userId)
    );
    users = usersFixtures.map(
      ({ id, login, email, password }) =>
        new User(id, new Login(login), new Email(email), password)
    );
    service = new RefreshTokenService(
      new RefreshTokenRepositoryMock(tokens),
      new UserServiceMock(new UserRepositoryMock(users))
    );
  });

  it("should find and return token", async () => {
    const toFind = "token1";
    const actualToken = await service.find(toFind);

    const token: RefreshToken = tokens.find(
      ({ refreshToken }) => refreshToken === toFind
    ) as RefreshToken;

    expect(actualToken.refreshToken).toBe(token.refreshToken);
  });

  it("should throw exception while searching", async () => {
    const toFind = "tokenNotExists";

    service.find(toFind).catch((e) => expect(e).toBeInstanceOf(Error));
  });

  it("should return tokens of user", async () => {
    const loginToFind = "login1";

    const user = users.find(({ login }) => login.value === loginToFind) as User;

    const actualResult = await service.findByUser(loginToFind);

    const expected = tokens.filter(({ userId }) => userId === user.id);

    expect(actualResult).toEqual(expected);
  });

  it("should return empty array", async () => {
    const login = "loginToNotFind";

    const actualResult = await service.findByUser(login);

    const expected: RefreshToken[] = [];

    expect(actualResult).toEqual(expected);
  });

  it("should remove token and return true", async () => {
    const tokenToFind = "token1";
    const actualResult = await service.remove(tokenToFind);
    const actualTokens = tokens.filter(
      ({ refreshToken }) => refreshToken !== tokenToFind
    );
    const expectedTokens = await service.all();
    expect(actualResult).toBeTruthy();
    expect(actualTokens).toEqual(expectedTokens);
  });

  it("shouldn't remove token and return false", async () => {
    const actualResult = await service.remove("token123");
    const actualTokens = [...tokens];
    const expectedTokens = await service.all();
    expect(actualResult).toBeTruthy();
    expect(actualTokens).toEqual(expectedTokens);
  });

  it("should return all tokens", async () => {
    const actualResult = await service.all();
    expect(actualResult).toEqual(tokens);
  });

  it("should create new token and return it", async () => {
    const login = "login1";
    const actualResult = await service.create(login);
    const expectedResult = await service.find(actualResult.refreshToken);
    expect(actualResult).toEqual(expectedResult);
  });
});
