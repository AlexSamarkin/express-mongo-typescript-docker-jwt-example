import "reflect-metadata";
import { UserRepository } from "./user.repository";
import { UserModel } from "../models/mongo/user";
import { User } from "../models/user";
import { injectable } from "inversify";
import { Login } from "../value-objects/login";
import { Email } from "../value-objects/email";

@injectable()
export class UserMongoRepository implements UserRepository {
  async create(login: string, email: string, password: string): Promise<User> {
    const user = await UserModel.create({
      login,
      email,
      password,
    });

    return new User(
      user._id,
      new Login(user.login),
      new Email(user.email),
      user.password
    );
  }

  async find(login: string): Promise<User | null> {
    const result = await UserModel.findOne({ login });
    if (!result) {
      return null;
    }
    return new User(
      result._id,
      new Login(result.login),
      new Email(result.email),
      result.password
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await UserModel.findOne({ email });
    if (!result) {
      return null;
    }
    return new User(
      result._id,
      new Login(result.login),
      new Email(result.email),
      result.password
    );
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find();
    return result.map(
      ({ login, password, email, _id }) =>
        new User(_id, new Login(login), new Email(email), password)
    );
  }
}

export default new UserMongoRepository();
