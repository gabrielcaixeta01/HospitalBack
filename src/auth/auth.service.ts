import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService, User } from './user.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<Partial<User> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: Partial<User>) {
    if (!user) throw new UnauthorizedException();
    const payload = { username: user.username, sub: user.id, roles: user.roles || [] };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
