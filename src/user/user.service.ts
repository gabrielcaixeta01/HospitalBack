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

  // Fields returned to clients (exclude senha)
  private readonly publicSelect = {
    id: true,
    nome: true,
    email: true,
    profilepic: true,
    criadoEm: true,
  } as const;

  // Cria um usuário
  async create(data: CreateUserDto) {
    const { nome, email } = data;
    // Accept either `senha` (Portuguese) or `password` (English) from different frontends
    const maybe = data as unknown as { senha?: string; password?: string };
    const rawPassword = maybe.senha ?? maybe.password;
    if (!rawPassword || typeof rawPassword !== 'string') {
      throw new BadRequestException('Password (senha) is required');
    }
    // hash senha before persisting
    const hashed = await bcrypt.hash(rawPassword, 10);

    const payload: Partial<Prisma.UserCreateInput> = {
      nome,
      email,
      senha: hashed,
    };
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

    // create and return a public view (exclude senha)
    return await this.prisma.user.create({
      data: payload as Prisma.UserCreateInput,
      select: this.publicSelect,
    });
  }

  // Verify password for a Prisma User record
  async verifyPassword(user: { senha: string }, password: string) {
    return bcrypt.compare(password, user.senha);
  }

  // Retorna todos os usuários
  async findAll() {
    return await this.prisma.user.findMany({ select: this.publicSelect });
  }

  // find a single user for public consumption (no senha)
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

  // Compatibility methods expected by controllers
  async findUserById(id: number) {
    return this.findUser(id);
  }

  // This method is used by AuthService and must include the senha for password verification.
  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  // Public variant that excludes senha
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

    // delete and return public view
    return await this.prisma.user.delete({
      where: { id },
      select: this.publicSelect,
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
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
      select: this.publicSelect,
    });
  }
}
