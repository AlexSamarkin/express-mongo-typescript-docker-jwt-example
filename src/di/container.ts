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

const UserRepositoryImplementation =
  config.env === "production" || config.env === "development"
    ? UserMongoRepository
    : UserMongoRepository;
const RefreshTokenRepositoryImplementation =
  config.env === "production" || config.env === "development"
    ? RefreshTokenMongoRepository
    : RefreshTokenMongoRepository;

const UserServiceImplementation =
  config.env === "production" || config.env === "development"
    ? UserService
    : UserService;

const diContainer = new Container();
diContainer.bind<IUserService>(TYPES.UserService).to(UserServiceImplementation);
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
