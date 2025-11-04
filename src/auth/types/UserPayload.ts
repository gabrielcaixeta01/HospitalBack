export interface UserPayload {
  sub: number;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}
