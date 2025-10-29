import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user-dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria um usuário
  async create(data: CreateUserDto) {
    const { nome, email, senha } = data;

    const payload: any = { nome, email, senha };
    // normalize profilepic to Uint8Array for Prisma bytes field
    if (data.profilepic) {
      const pic = data.profilepic as unknown;
      let bytes: Uint8Array | undefined;
      if (typeof pic === 'string') {
        // assume base64
        const buf = Buffer.from(pic, 'base64');
        bytes = new Uint8Array(buf);
      } else if (Buffer.isBuffer(pic)) {
        bytes = new Uint8Array(pic);
      } else if (pic instanceof Uint8Array) {
        bytes = pic;
      }
      if (bytes) payload.profilepic = bytes;
    }

    return await this.prisma.user.create({ data: payload });
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
    const { ...updateData } = data as any;

    // normalize profilepic if present
    if (updateData.profilepic) {
      const pic = updateData.profilepic;
      if (typeof pic === 'string') {
        const buf = Buffer.from(pic, 'base64');
        updateData.profilepic = new Uint8Array(buf);
      } else if (Buffer.isBuffer(pic)) {
        updateData.profilepic = new Uint8Array(pic);
      }
    }

    return await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...updateData,
      },
    });
  }
}