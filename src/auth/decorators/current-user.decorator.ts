/* eslint-disable prettier/prettier */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserPayload } from '../types/UserPayload';

export const CurrentUser = createParamDecorator(
  (data: keyof UserPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request & { user?: UserPayload }>();
    const user = request.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);