export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'dev_jwt_secret',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
