import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import type { User as PrismaUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<PrismaUser> {
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

  signToken(user: PrismaUser) {
    const payload = {
      sub: Number(user.id),
      email: user.email,
    };
    return this.jwt.sign(payload);
  }
}
