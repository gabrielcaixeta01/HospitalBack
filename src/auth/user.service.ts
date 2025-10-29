import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  password: string; // plain-text for skeleton only
  roles?: string[];
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    {
      id: 1,
      username: process.env.AUTH_USER || 'admin',
      password: process.env.AUTH_PASS || 'password',
      roles: ['admin'],
    },
  ];

  findOneByUsername(username: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.username === username);
    return Promise.resolve(user);
  }
}
