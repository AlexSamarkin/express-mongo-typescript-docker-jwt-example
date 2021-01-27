import { RefreshTokenRepositoryMock } from "../mocks/refresh-token-repository.mock";
import userServiceMock from "../mocks/user-service.mock";
import tokensFixture from "../fixtures/refresh-tokens";
import {
  RefreshTokenService,
  IRefreshTokenService,
} from "../../services/refresh-token.service";
import { RefreshTokenNotFoundException } from "../../exceptions/refresh-token-not-found.exception";
import { RefreshToken } from "../../models/domain";

let service: IRefreshTokenService;
let tokens: RefreshToken[];

describe("RefreshTokenService", () => {
  beforeEach(() => {
    tokens = [...tokensFixture];
    service = new RefreshTokenService(
      new RefreshTokenRepositoryMock(tokens),
      userServiceMock
    );
  });

  it("find - returns token", async () => {
    const toFind = "token1";
    const actualToken = await service.find(toFind);

    expect(actualToken).toEqual(
      tokens.find(({ refreshToken }) => refreshToken === toFind)
    );
  });

  it("find - throws exception", async () => {
    const toFind = "tokenNotExists";

    service
      .find(toFind)
      .catch((e) => expect(e).toBeInstanceOf(RefreshTokenNotFoundException));
  });

  it("should return tokens of user", async () => {
    const login = "login1";

    const actualResult = await service.findByUser(login);

    const expected = tokens.filter(({ userLogin }) => userLogin === login);

    expect(actualResult).toEqual(expected);
  });

  it("should return empty array", async () => {
    const login = "loginToNotFind";

    const actualResult = await service.findByUser(login);

    const expected: RefreshToken[] = [];

    expect(actualResult).toEqual(expected);
  });

  it("should remove token and return true", async () => {
    const actualResult = await service.remove("token1");
    const actualTokens = tokens.filter(
      ({ refreshToken }) => refreshToken !== "token1"
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
