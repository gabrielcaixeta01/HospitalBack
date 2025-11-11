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

    const emailVal = (dto as unknown as { email?: unknown }).email;
    if (typeof emailVal !== 'string' || emailVal.trim() === '') {
      throw new BadRequestException('Email is required');
    }

    type AuthenticatedUser = {
      id: number | bigint;
      email: string;
      nome?: string;
      criadoEm?: Date;
    };
    const user = (await this.auth.validateUser(
      emailVal,
      rawPassword,
    )) as unknown as AuthenticatedUser;
    const token = this.auth.signToken({ id: user.id, email: user.email });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { access_token: token };
  }

  @Get('profile')
  async profile(@CurrentUser() user: JwtPayload) {
    // Return the public user record (id, nome, email, criadoEm)
    return await this.usersService.findUserById(Number(user.sub));
  }

  @Get('me')
  async me(@CurrentUser() user: JwtPayload) {
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
    const user = await this.usersService.create(dto);

    const token = this.auth.signToken({ id: user.id, email: user.email });

    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const safeUser = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      criadoEm: user.criadoEm,
    };

    return {
      access_token: token,
      user: safeUser,
    };
  }
}
