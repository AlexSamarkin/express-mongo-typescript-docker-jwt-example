import { UserRepository } from "./user.repository";
import { UserModel } from "../models/mongo/user";
import { User } from "../models/user";

export class UserMongoRepository implements UserRepository {
  async create(login: string, password: string): Promise<User> {
    const user = await UserModel.create({
      login,
      password,
    });

    return new User(user._id, user.login, user.password);
  }

  async find(login: string): Promise<User | null> {
    const result = await UserModel.findOne({ login });
    if (!result) {
      return null;
    }
    return new User(result._id, result.login, result.password);
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find();
    return result.map(
      ({ login, password, _id }) => new User(_id, login, password)
    );
  }
}

export default new UserMongoRepository();
