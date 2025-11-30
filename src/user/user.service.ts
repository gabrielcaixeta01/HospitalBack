/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import type { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly publicSelect = {
    id: true,
    nome: true,
    email: true,
    criadoEm: true,
  } as const;

  async create(data: CreateUserDto) {
    const { nome, email } = data;
    const maybe = data as unknown as { senha?: string; password?: string };
    const rawPassword = maybe.senha ?? maybe.password;
    if (!rawPassword || typeof rawPassword !== 'string') {
      throw new BadRequestException('Password (senha) is required');
    }
    const hashed = await bcrypt.hash(rawPassword, 10);

    const payload: Partial<Prisma.UserCreateInput> = {
      nome,
      email,
      senha: hashed,
    };

    return await this.prisma.user.create({
      data: payload as Prisma.UserCreateInput,
      select: this.publicSelect,
    });
  }

  async verifyPassword(user: { senha: string }, password: string) {
    return bcrypt.compare(password, user.senha);
  }

  async findAll() {
    return await this.prisma.user.findMany({ select: this.publicSelect });
  }

  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.publicSelect,
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  async findUserById(id: number) {
    return this.findUser(id);
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findPublicByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: this.publicSelect,
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return await this.prisma.user.delete({
      where: { id },
      select: this.publicSelect,
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
    const updateData: Partial<UpdateUserDto> = { ...data };

    return await this.prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
      select: this.publicSelect,
    });
  }
}
