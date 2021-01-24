import bcrypt from "bcryptjs";
import { Model } from "mongoose";
import { UserModel } from "../models/user";
import { User } from "../models/types";

export interface IUserService {
  find(login: string): Promise<User>;
  all(): Promise<User[]>;
  create(login: string, password: string): Promise<User>;
}

export class UserService implements IUserService {
  constructor(private readonly repository: Model<any>) {}

  async find(login: string): Promise<User> {
    const result = await this.repository.findOne({ login });
    return {
      login: result.login,
      password: result.password,
    };
  }

  async all(): Promise<User[]> {
    const result = await this.repository.find();
    return result.map((userResult) => {
      return {
        login: userResult.login,
        password: userResult.password,
      };
    });
  }

  async create(login: string, password: string): Promise<User> {
    try {
      const result = await this.repository.create({
        login,
        password: bcrypt.hashSync(password),
      });
      return {
        login: result.login,
        password: result.password,
      };
    } catch (e) {
      return e;
    }
  }
}

export default new UserService(UserModel);
