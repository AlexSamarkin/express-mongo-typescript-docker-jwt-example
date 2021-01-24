export interface User {
  login: string;
  password: string;
}

export interface RefreshToken {
  refreshToken: string;
  userLogin: string;
}
