import { User } from "../models/user";

export interface UserRepository {
  getAll(): Promise<User[]>;
  find(login: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(login: string, email: string, password: string): Promise<User>;
}
