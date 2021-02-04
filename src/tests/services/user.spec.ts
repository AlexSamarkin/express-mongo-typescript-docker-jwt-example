import { IUserService, UserService } from "../../services/user.service";
import { UserRepositoryMock } from "../mocks/user-repository.mock";
import usersFixtures from "../fixtures/users";
import { CreateUserDto } from "../../dto/create-user-dto";
import { UserCreateException } from "../../exceptions/user-create-exception";
import { User } from "../../models/user";
import { Login } from "../../value-objects/login";
import { Email } from "../../value-objects/email";

let service: IUserService;
let users: User[];

describe("UserService", () => {
  beforeEach(() => {
    users = usersFixtures.map(
      ({ id, login, email, password }) =>
        new User(id, new Login(login), new Email(email), password)
    );
    service = new UserService(new UserRepositoryMock(users));
  });

  test("should return all users", async () => {
    const actualUsers = await service.all();
    expect(actualUsers).toEqual(users);
  });

  it("should return one user by login", async () => {
    const loginToFind = new Login("login1");
    const actualUser = await service.find(loginToFind);
    const expectedUser = users.find(
      (user) => user.login.value === loginToFind.value
    );
    expect(actualUser).toEqual(expectedUser);
  });

  it("should return one user by email", async () => {
    const emailToFind = new Email("login1@google.com");
    const actualUser = await service.findByEmail(emailToFind);
    const expectedUser = users.find(
      (user) => user.email.value === emailToFind.value
    );
    expect(actualUser).toEqual(expectedUser);
  });

  it("should throw error - user by login not found", () => {
    const loginToFind = new Login("loginNotExists");
    service.find(loginToFind).catch((e) => expect(e).toBeInstanceOf(Error));
  });

  it("should throw error - user by email  not found", () => {
    const emailToFind = new Email("email@notexists.com");
    service
      .findByEmail(emailToFind)
      .catch((e) => expect(e).toBeInstanceOf(Error));
  });

  it("should create user and return it", async () => {
    const dto = new CreateUserDto(
      "some-login",
      "some-email@email.com",
      "some-password"
    );
    const user = await service.create(dto);
    const userFromDB = users.find((user) => user.login.value === dto.login);

    expect(user).toEqual(userFromDB);
  });

  it("should throw error while trying to create existing user", () => {
    const dto = new CreateUserDto(
      "login1",
      "login1@gmail.com",
      "some-password"
    );
    service
      .create(dto)
      .catch((e) => expect(e).toBeInstanceOf(UserCreateException));
  });
});
