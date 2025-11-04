import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtAuthGuard } from '../jwt-auth.guard';

@Injectable()
export class PublicAwareAuthGuard extends JwtAuthGuard {
  constructor(private readonly localReflector: Reflector) {
    super();
  }
  canActivate(ctx: ExecutionContext) {
    const isPublic = this.localReflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      [[ctx.getHandler(), ctx.getClass()]],
            ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
}
