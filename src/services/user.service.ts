import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { UserRepository } from "../repositories/user.repository";
import userMongoRepository from "../repositories/user-mongo.repository";
import { CreateUserDto } from "../dto/create-user-dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserCreateException } from "../exceptions/user-create-exception";

export interface IUserService {
  find(login: string): Promise<User>;
  all(): Promise<User[]>;
  create(createUser: CreateUserDto): Promise<User>;
}

export class UserService implements IUserService {
  constructor(private readonly repository: UserRepository) {}

  async find(login: string): Promise<User> {
    const user = await this.repository.find(login);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async all(): Promise<User[]> {
    return await this.repository.getAll();
  }

  async create(createUser: CreateUserDto): Promise<User> {
    try {
      return await this.repository.create(
        createUser.login,
        bcrypt.hashSync(createUser.password)
      );
    } catch (e) {
      throw new UserCreateException();
    }
  }
}

export default new UserService(userMongoRepository);
