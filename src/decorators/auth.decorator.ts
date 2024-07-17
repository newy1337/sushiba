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
    console.log(user);
    return user;
  }
}

interface AuthOptions {
  optional?: boolean;
}

export const Auth = (options?: AuthOptions) => {
  console.log(2223);
  if (options?.optional) {
    return UseGuards(OptionalAuthGuard);
  } else {
    return UseGuards(AuthGuard, RolesGuard);
  }
};
