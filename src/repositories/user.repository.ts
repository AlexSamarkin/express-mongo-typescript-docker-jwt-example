import { User } from "../models/user";

export interface UserRepository {
  getAll(): Promise<User[]>;
  find(login: string): Promise<User | null>;
  create(login: string, password: string): Promise<User>;
}
