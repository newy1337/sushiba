import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: User) {
    let needCompleteAuth = false;
    if (!user.name || !user.email) {
      needCompleteAuth = true;
    }
    return { ...user, needCompleteAuth };
  }
}
