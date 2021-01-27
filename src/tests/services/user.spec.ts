import { IUserService, UserService } from "../../services/user.service";
import { UserRepositoryMock } from "../mocks/user-repository.mock";
import usersFixtures from "../fixtures/users";
import { UserNotFoundException } from "../../exceptions/user-not-found.exception";
import { CreateUserDto } from "../../dto/create-user-dto";
import { UserCreateException } from "../../exceptions/user-create-exception";
import { User } from "../../models/user";

let service: IUserService;
let users: User[];

describe("UserService", () => {
  beforeEach(() => {
    users = usersFixtures.map(
      ({ id, login, password }) => new User(id, login, password)
    );
    service = new UserService(new UserRepositoryMock(users));
  });

  test("should return all users", async () => {
    const actualUsers = await service.all();
    expect(actualUsers).toEqual(users);
  });

  it("should return one user by login", async () => {
    const loginToFind = "login1";
    const actualUser = await service.find(loginToFind);
    expect(actualUser).toEqual(
      users.find((user) => user.login === loginToFind)
    );
  });

  it("should throw error - user not found", () => {
    const loginToFind = "loginNotExists";
    service
      .find(loginToFind)
      .catch((e) => expect(e).toBeInstanceOf(UserNotFoundException));
  });

  it("should create user and return it", async () => {
    const dto = new CreateUserDto("some-login", "some-password");
    const user = await service.create(dto);
    const userFromDB = users.find((user) => user.login === dto.login);

    expect(user).toEqual(userFromDB);
  });

  it("should throw error while trying to create existing user", () => {
    const dto = new CreateUserDto("login1", "some-password");
    service
      .create(dto)
      .catch((e) => expect(e).toBeInstanceOf(UserCreateException));
  });
});
