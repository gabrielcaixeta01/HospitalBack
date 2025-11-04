import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { AUTH_COOKIE_NAME } from './constants';

function fromAuthCookie(req: Request) {
  const anyReq = req as unknown as { cookies?: Record<string, unknown> };
  const raw = anyReq?.cookies?.[AUTH_COOKIE_NAME];
  return typeof raw === 'string' ? raw : null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        fromAuthCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.JWT_SECRET || 'dev-secret',
      ignoreExpiration: false,
    });
  }

  // payload: o que foi assinado no token
  validate(payload: { sub: number; email: string; role?: string }) {
    return payload;
  }
}