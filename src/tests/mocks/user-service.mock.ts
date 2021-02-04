import { IUserService } from "../../services/user.service";
import { UserRepository } from "../../repositories/user.repository";
import { CreateUserDto } from "../../dto/create-user-dto";
import { User } from "../../models/user";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";
import { Login } from "../../value-objects/login";
import { Email } from "../../value-objects/email";

export class UserServiceMock implements IUserService {
  constructor(private repository: UserRepository) {}

  async all(): Promise<User[]> {
    return await this.repository.getAll();
  }

  async create(createUser: CreateUserDto): Promise<User> {
    return await this.repository.create(
      createUser.login,
      createUser.email,
      createUser.password
    );
  }

  async find(login: Login): Promise<User> {
    const user = await this.repository.find(login.value);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByEmail(email: Email): Promise<User> {
    const user = await this.repository.find(email.value);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
