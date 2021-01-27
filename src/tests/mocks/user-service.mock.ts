import { IUserService } from "../../services/user.service";
import userRepositoryMock from "./user-repository.mock";
import { UserRepository } from "../../repositories/user.repository";
import { CreateUserDto } from "../../dto/create-user-dto";
import { User } from "../../models/domain";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";

export class UserServiceMock implements IUserService {
  constructor(private repository: UserRepository) {}

  async all(): Promise<User[]> {
    return await this.repository.getAll();
  }

  async create(createUser: CreateUserDto): Promise<User> {
    return await this.repository.create(createUser.login, createUser.password);
  }

  async find(login: string): Promise<User> {
    const user = await this.repository.find(login);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}

export default new UserServiceMock(userRepositoryMock);
