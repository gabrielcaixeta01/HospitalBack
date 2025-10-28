import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from './user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    password: 'testpass',
    roles: ['admin'],
  };

  const mockUsersService = {
    findOneByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should successfully validate a user with correct credentials', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'testpass');

      expect(result).toEqual({
        id: '1',
        username: 'testuser',
        roles: ['admin'],
      });
      expect(result).not.toHaveProperty('password');
      expect(mockUsersService.findOneByUsername).toHaveBeenCalledWith(
        'testuser',
      );
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(undefined);

      const result = await authService.validateUser('nonexistent', 'testpass');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      mockUsersService.findOneByUsername.mockResolvedValue(mockUser);

      const result = await authService.validateUser('testuser', 'wrongpass');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate a valid JWT access token for a given user', async () => {
      const expectedToken = 'mocked.jwt.token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      const user = {
        id: '1',
        username: 'testuser',
        roles: ['admin'],
      };

      const result = authService.login(user);

      expect(result).toEqual({
        accessToken: expectedToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'testuser',
        sub: 1,
        roles: ['admin'],
      });
    });

    it('should include empty roles array if user has no roles', async () => {
      const expectedToken = 'mocked.jwt.token';
      mockJwtService.sign.mockReturnValue(expectedToken);

      const user = {
        id: '2',
        username: 'noroluser',
      };

      const result = await authService.login(user);

      expect(result).toEqual({
        accessToken: expectedToken,
      });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'noroluser',
        sub: 2,
        roles: [],
      });
    });

    it('should throw UnauthorizedException when user is null', async () => {
      await expect(authService.login(null)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is undefined', async () => {
      await expect(authService.login(undefined)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
