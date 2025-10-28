import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should correctly extract and return user information from a valid JWT payload', async () => {
      const payload = {
        sub: 1,
        username: 'testuser',
        roles: ['admin', 'user'],
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        username: 'testuser',
        roles: ['admin', 'user'],
      });
    });

    it('should handle payload with empty roles array', async () => {
      const payload = {
        sub: 2,
        username: 'basicuser',
        roles: [],
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 2,
        username: 'basicuser',
        roles: [],
      });
    });

    it('should handle payload without roles', async () => {
      const payload = {
        sub: 3,
        username: 'noroluser',
      };

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual({
        userId: 3,
        username: 'noroluser',
        roles: undefined,
      });
    });

    it('should correctly map sub to userId', async () => {
      const payload = {
        sub: 999,
        username: 'testuser',
        roles: ['admin'],
      };

      const result = await jwtStrategy.validate(payload);

      expect(result.userId).toBe(999);
      expect(result).not.toHaveProperty('sub');
    });
  });
});
