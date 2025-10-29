import type { StringValue } from 'ms';

export const jwtConstants: {
  secret: string;
  expiresIn?: StringValue | number;
} = {
  secret: process.env.JWT_SECRET || 'dev_jwt_secret',
  expiresIn: (process.env.JWT_EXPIRES_IN as unknown as StringValue) || '1h',
};
