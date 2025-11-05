import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
// Accept a minimal user shape (id + email) for signing tokens so callers can pass public-safe users
type MinimalUserForToken = { id: number | bigint; email: string };
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.users.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const match = await bcrypt.compare(password, user.senha);
    if (!match) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return user;
  }

  signToken(user: MinimalUserForToken) {
    const payload = {
      sub: Number(user.id),
      email: user.email,
    };
    return this.jwt.sign(payload);
  }
}
