import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../models/user";
import { v4 } from "uuid";
import users from "../fixtures/users";

export class UserRepositoryMock implements UserRepository {
  constructor(private users: User[]) {}
  async create(login: string, password: string): Promise<User> {
    const user = new User(v4(), login, password);
    this.users.push(user);
    return Promise.resolve(user);
  }

  async find(login: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.login === login) || null
    );
  }

  async getAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
