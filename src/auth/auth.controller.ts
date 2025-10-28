import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    [key: string]: any;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const potentialUser = (await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    )) as unknown;

    if (!potentialUser || typeof potentialUser !== 'object') {
      throw new UnauthorizedException();
    }

    const user = potentialUser as {
      id: number;
      username: string;
      [key: string]: any;
    };
    const authUser = {
      ...user,
      id: String(user.id),
    };
    return this.authService.login(authUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest): {
    id: number;
    username: string;
    [key: string]: any;
  } {
    return req.user;
  }
}
