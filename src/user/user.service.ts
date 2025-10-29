import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um usuário
  async create(data: CreateUserDto) {
    const { nome, email, senha } = data;

    const payload: Partial<Prisma.UserCreateInput> = { nome, email, senha };
    // normalize profilepic to base64 string for Prisma (schema uses String)
    if (data.profilepic) {
      const pic = data.profilepic as unknown;
      if (typeof pic === 'string') {
        // assume already base64 or url
        payload.profilepic = pic;
      } else if (Buffer.isBuffer(pic)) {
        payload.profilepic = pic.toString('base64');
      } else if (pic instanceof Uint8Array) {
        payload.profilepic = Buffer.from(pic).toString('base64');
      }
    }

    return await this.prisma.user.create({
      data: payload as Prisma.UserCreateInput,
    });
  }

  // Retorna todos os usuários
  async findAll() {
    return await this.prisma.user.findMany();
  }
  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return user;
  }

  // Compatibility methods expected by controllers
  async findUserById(id: number) {
    return this.findUser(id);
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  // Atualiza um usuário
  async updateUser(id: number, data: UpdateUserDto) {
    const updateData: Partial<
      UpdateUserDto & { profilepic?: string | Buffer | Uint8Array }
    > = { ...data };

    // normalize profilepic to base64 string if present
    if (updateData.profilepic) {
      const pic = updateData.profilepic as unknown;
      if (typeof pic === 'string') {
        updateData.profilepic = pic;
      } else if (Buffer.isBuffer(pic)) {
        updateData.profilepic = pic.toString('base64');
      } else if (pic instanceof Uint8Array) {
        updateData.profilepic = Buffer.from(pic).toString('base64');
      }
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: updateData as Prisma.UserUpdateInput,
    });
  }
}
