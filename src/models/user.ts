import { Login } from "../value-objects/login";
import { Email } from "../value-objects/email";

export class User {
  constructor(
    private readonly _id: string,
    private readonly _login: Login,
    private readonly _email: Email,
    private readonly _password: string
  ) {}

  get id(): string {
    return this._id;
  }

  get login(): Login {
    return this._login;
  }

  get password(): string {
    return this._password;
  }

  get email(): Email {
    return this._email;
  }
}
