import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Если возникла ошибка или пользователь не найден, возвращаем undefined
    if (err || !user) {
      return undefined;
    }
    // Иначе возвращаем пользователя
    return user;
  }
}

export const Auth = (options?: { optional: boolean }) => {
  return UseGuards(options?.optional ? OptionalAuthGuard : AuthGuard('jwt'));
};
