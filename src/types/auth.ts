export type Role = 'ADMIN' | 'MANUFACTURER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  manufacturerId: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}
