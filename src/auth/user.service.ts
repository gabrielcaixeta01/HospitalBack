import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor() {
    // If this service is accidentally injected somewhere, throw at runtime to make the issue obvious.
    // In production code we'd remove this file entirely, but keeping a clear stub helps CI and local builds
    // until references are cleaned up.
  }

  findByEmail(): never {
    throw new Error(
      'Legacy UserService (src/auth/user.service.ts) was removed. Use src/user/user.service.ts instead.',
    );
  }

  verifyPassword(): never {
    throw new Error(
      'Legacy UserService (src/auth/user.service.ts) was removed. Use src/user/user.service.ts instead.',
    );
  }
}
