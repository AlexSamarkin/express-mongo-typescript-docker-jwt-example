export class RefreshToken {
  constructor(
    private readonly _refreshToken: string,
    private readonly _userLogin: string
  ) {}

  get refreshToken(): string {
    return this._refreshToken;
  }

  get userLogin(): string {
    return this._userLogin;
  }
}
