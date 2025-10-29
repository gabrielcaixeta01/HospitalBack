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

    return await this.prisma.user.create({
      data: {
        nome,
        email,
        senha,
      },
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
    const { ...updateData } = data;

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