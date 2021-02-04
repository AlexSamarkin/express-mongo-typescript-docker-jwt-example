export class RefreshToken {
  constructor(
    private readonly _refreshToken: string,
    private readonly _userId: string
  ) {}

  get refreshToken(): string {
    return this._refreshToken;
  }

  get userId(): string {
    return this._userId;
  }
}
