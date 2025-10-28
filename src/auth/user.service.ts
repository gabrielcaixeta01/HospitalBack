import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  password: string; // plain text for skeleton only — DO NOT use in production
  roles?: string[];
};

@Injectable()
export class UsersService {
  // Simple in-memory user for skeleton/demo purposes
  private readonly users: User[] = [
    {
      id: 1,
      username: process.env.AUTH_USER || 'admin',
      password: process.env.AUTH_PASS || 'password',
      roles: ['admin'],
    },
  ];

  findOneByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(this.users.find((u) => u.username === username));
  }
}
