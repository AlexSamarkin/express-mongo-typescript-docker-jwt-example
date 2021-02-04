import { Container } from "inversify";
import { TYPES } from "./types";
import { IUserService, UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import {
  IRefreshTokenService,
  RefreshTokenService,
} from "../services/refresh-token.service";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository";
import config from "../config";
import { UserMongoRepository } from "../repositories/user-mongo.repository";
import { RefreshTokenMongoRepository } from "../repositories/refresh-token-mongo.repository";
import { isTest } from "../utils";
import { UserTestRepository } from "../tests/app/repositories/user-test.repository";
import { RefreshTokenTestRepository } from "../tests/app/repositories/refresh-token-test.repository";

const UserRepositoryImplementation = isTest(config.env)
  ? UserTestRepository
  : UserMongoRepository;

const RefreshTokenRepositoryImplementation = isTest(config.env)
  ? RefreshTokenTestRepository
  : RefreshTokenMongoRepository;

const diContainer = new Container();
diContainer.bind<IUserService>(TYPES.UserService).to(UserService);
diContainer
  .bind<UserRepository>(TYPES.UserRepository)
  .to(UserRepositoryImplementation);
diContainer
  .bind<IRefreshTokenService>(TYPES.RefreshTokenService)
  .to(RefreshTokenService);
diContainer
  .bind<RefreshTokenRepository>(TYPES.RefreshTokenRepository)
  .to(RefreshTokenRepositoryImplementation);

export { diContainer };
