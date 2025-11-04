import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  ValidationPipe,
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
    const user = await this.auth.validateUser(dto.email, dto.password);
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

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    return { ok: true };
  }

  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) dto: CreateUserDto) {
    // delegate to UsersService which uses Prisma
    // controller-level conversion: if profilepic is base64 string, keep it (UsersService normalizes)
    return await this.usersService.create(dto);
  }
}
