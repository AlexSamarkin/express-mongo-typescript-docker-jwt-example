export class CreateUserDto {
  constructor(
    private readonly _login: string,
    private readonly _email: string,
    private readonly _password: string
  ) {}

  get login(): string {
    return this._login;
  }

  get password(): string {
    return this._password;
  }

  get email(): string {
    return this._email;
  }
}
