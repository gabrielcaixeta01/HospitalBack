import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { JwtPayload } from './decorators/current-user.decorator';
import { AUTH_COOKIE_NAME } from './constants';
import { UsersService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user-dto';
// Prisma types are used elsewhere; no import needed here

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const maybe = dto as unknown as { senha?: string; password?: string };
    const rawPassword = maybe.password ?? maybe.senha;
    if (!rawPassword) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.auth.validateUser(dto.email, rawPassword);
    const token = this.auth.signToken(user);

    // cookie httpOnly (front lê via requisição / profile)
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true em produção c/ HTTPS
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: token };
  }

  @Get('profile')
  profile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    // alias for /profile used by some frontends
    return this.profile(user);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    return { ok: true };
  }

  @Public()
  @Post('register')
  async register(
    @Body(ValidationPipe) dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Create the user (UsersService hashes the password)
    const user = await this.usersService.create(dto);

    // Sign JWT (auto-login)
    const token = this.auth.signToken(user);

    // set cookie on root path to mirror login behavior
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Build a safe user object without the senha field to return to the client
    const safeUser = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      profilepic: user.profilepic ?? null,
      criadoEm: user.criadoEm,
    };

    return {
      access_token: token,
      user: safeUser,
    };
  }
}
