import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as PassportJwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from './constants';

interface JwtPayload {
  sub: string;
  username: string;
  roles?: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(PassportJwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: (req: any): string | null => {
        if (!req || !req.headers) return null;
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const header = Array.isArray(authHeader) ? authHeader[0] : authHeader;
        if (!header || typeof header !== 'string') return null;
        const parts = header.split(' ');
        if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
          return parts[1];
        }
        return null;
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
