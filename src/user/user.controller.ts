import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ValidationPipe,
  ParseIntPipe,
  Delete,
  Patch,
  NotFoundException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { UserPayload } from 'src/auth/types/UserPayload';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post()
  async create(@Body(ValidationPipe) userData: CreateUserDto) {
    // profilepic was removed from schema; ignore any such field
    return await this.userService.create(userData);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Public()
  @Get(':id')
  async findUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Erro ao buscar o usuário: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Get('email/:email')
  async findUserByEmail(@Param('email') email: string) {
    try {
      // Use the public variant to avoid returning the senha (password hash)
      const user = await this.userService.findPublicByEmail(email);
      if (!user) {
        throw new NotFoundException(
          `Usuário com email ${email} não encontrado`,
        );
      }
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Erro ao buscar o usuário por email: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: UserPayload,
  ) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }
      if (id !== currentUser.sub) {
        throw new UnauthorizedException(
          'Você só pode deletar sua própria conta.',
        );
      }
      await this.userService.deleteUser(id);
      return { message: 'Usuário deletado com sucesso' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Erro ao excluir o usuário: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) data: UpdateUserDto,
    @CurrentUser() currentUser: UserPayload,
  ) {
    try {
      // Verifica permissão
      if (id !== currentUser.sub) {
        throw new UnauthorizedException(
          'Você só pode editar sua própria conta.',
        );
      }
      // profilepic removed from schema; ignore profilepic in payload if present
      const updated = await this.userService.updateUser(id, data);
      return updated;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      throw new HttpException(
        `Erro ao atualizar o usuário: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
