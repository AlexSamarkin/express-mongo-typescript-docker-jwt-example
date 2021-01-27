export class User {
  constructor(
    private readonly _id: string,
    private readonly _login: string,
    private readonly _password: string
  ) {}

  get id(): string {
    return this._id;
  }

  get login(): string {
    return this._login;
  }

  get password(): string {
    return this._password;
  }
}
