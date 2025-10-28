import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';

type AuthUser = {
  id: string;
  username: string;
  password?: string;
  roles?: string[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = (await this.usersService.findOneByUsername(username)) as
      | AuthUser
      | undefined;

    if (user && user.password === pass) {
      const result = {
        id: user.id,
        username: user.username,
        roles: user.roles ?? [],
      };
      return result;
    }
    return null;
  }

  login(user: AuthUser | null | undefined) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles || [],
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
