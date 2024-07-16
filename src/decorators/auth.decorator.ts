import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guards';

@Injectable()
class OptionalAuthGuard {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      return undefined;
    }
    // Иначе возвращаем пользователя
    return user;
  }
}

export const Auth = (options?: { optional: boolean }) => {
  return UseGuards(
    options?.optional ? OptionalAuthGuard : AuthGuard,
    RolesGuard,
  );
};
