import { UserRepository } from "../../repositories/user.repository";
import { User } from "../../models/user";
import { v4 } from "uuid";
import { Login } from "../../value-objects/login";
import { Email } from "../../value-objects/email";

export class UserRepositoryMock implements UserRepository {
  constructor(private readonly users: User[]) {}
  async create(login: string, email: string, password: string): Promise<User> {
    const user = new User(v4(), new Login(login), new Email(email), password);
    this.users.push(user);
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.email.value === email) || null
    );
  }

  async find(login: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.login.value === login) || null
    );
  }

  async getAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
}
