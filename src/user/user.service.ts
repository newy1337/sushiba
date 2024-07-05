import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(user: User) {
    let needCompleteRegister = false;
    if (!user.name || !user.email) {
      needCompleteRegister = true;
    }
    return { ...user, needCompleteRegister };
  }
}
