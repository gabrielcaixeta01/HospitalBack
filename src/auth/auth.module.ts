// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms'; // 👈 importa o tipo

const JWT_EXPIRES_IN: StringValue = '1h'; // ou 3600

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: JWT_EXPIRES_IN }, // 👈 agora compila
    }),
  ],
  // ...
})
export class AuthModule {}
