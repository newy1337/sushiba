import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';
import { sendOTP, validateOTP } from '../../utils/twilio';

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

  async updateMe(dto: UpdateUserDto, user: User) {
    if (user.phone != dto.phone && dto.otp === undefined) {
      await sendOTP(dto.phone);
      return { needOTP: true };
    }

    if (dto.otp !== undefined) {
      await validateOTP(dto.phone, dto.otp);
    }

    const userWithNewNumber = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (userWithNewNumber && userWithNewNumber.id != user.id) {
      throw new HttpException('User with same number already registered', 400);
    }
    delete dto.otp;
    return this.prisma.user.update({
      where: { id: user.id },
      data: dto,
    });
  }
}
