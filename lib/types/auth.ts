export type Role = "staff" | "student" | "parent";

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  image?: string;
  token: string;
  roles: Role[];
}

export type LoginRes = LoginResponse;

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  roles: Role[];
}

export interface Session {
  user: User;
  expires: string;
}

export interface Token {
  id: string;
  roles: Role[];
  user: User;
  sub: string;
}
