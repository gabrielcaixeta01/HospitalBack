import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  email: string;
  passwordHash: string;
  role?: string;
};

@Injectable()
export class UserService {
  // fake user (troque por busca no banco via Prisma)
  private users: User[] = [
    {
      id: 1,
      email: 'admin@hospital.local',
      passwordHash: 'admin',
      role: 'admin',
    },
  ];

  findByEmail(email: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((u) => u.email === email));
  }

  verifyPassword(user: User, password: string): Promise<boolean> {
    // substitua por bcrypt.compare
    return Promise.resolve(user.passwordHash === password);
  }
}
