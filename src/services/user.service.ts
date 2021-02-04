import "reflect-metadata";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDto } from "../dto/create-user-dto";
import { UserNotFoundException } from "../exceptions/user-not-found.exception";
import { UserCreateException } from "../exceptions/user-create-exception";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { Email } from "../value-objects/email";
import { Login } from "../value-objects/login";

export interface IUserService {
  find(login: Login): Promise<User>;
  findByEmail(email: Email): Promise<User>;
  all(): Promise<User[]>;
  create(createUser: CreateUserDto): Promise<User>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private readonly repository: UserRepository
  ) {}

  async find(login: Login): Promise<User> {
    const user = await this.repository.find(login.value);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByEmail(email: Email): Promise<User> {
    const user = await this.repository.findByEmail(email.value);
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
        createUser.email,
        bcrypt.hashSync(createUser.password)
      );
    } catch (e) {
      console.log(e);
      throw new UserCreateException();
    }
  }
}
