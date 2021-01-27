export interface User {
  login: string;
  password: string;
  id: string;
}

export interface RefreshToken {
  refreshToken: string;
  userLogin: string;
}
