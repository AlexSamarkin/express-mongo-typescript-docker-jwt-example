import { UserRepository } from "./user.repository";
import { UserModel } from "../models/mongo/user";
import { User } from "../models/domain";
import { UserCreateException } from "../exceptions/user-create-exception";

export class UserMongoRepository implements UserRepository {
  async create(login: string, password: string): Promise<User> {
    const user = await UserModel.create({
      login,
      password,
    });
    return {
      login: user.login,
      password: user.password,
      id: user._id,
    };
  }

  async find(login: string): Promise<User | null> {
    const result = await UserModel.findOne({ login });
    if (!result) {
      return null;
    }
    return {
      login: result.login,
      password: result.password,
      id: result._id,
    };
  }

  async getAll(): Promise<User[]> {
    const result = await UserModel.find();
    return result.map(({ login, password, _id }) => {
      return {
        login,
        password,
        id: _id,
      };
    });
  }
}

export default new UserMongoRepository();
