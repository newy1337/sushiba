import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dto/promocode.dto';

@Injectable()
export class PromocodeService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.promoCode.findMany({});
  }

  async getMy(userId: string) {
    return this.prisma.promoCode.findMany({
      where: {
        userId,
        active: true,
        validFrom: {
          lte: new Date(),
        },
        validTo: {
          gte: new Date(),
        },
      },
    });
  }

  async create(dto: CreatePromoCodeDto) {
    return this.prisma.promoCode.create({
      data: {
        code: dto.code,
        active: dto.active,
        discount: dto.discount,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        user: dto.userId ? { connect: { id: dto.userId } } : undefined,
        activationLimit: dto.activationLimit,
      },
    });
  }

  async update(id: string, dto: UpdatePromoCodeDto) {
    return this.prisma.promoCode.update({
      where: { id },
      data: {
        code: dto.code,
        active: dto.active,
        discount: dto.discount,
        validFrom: dto.validFrom,
        validTo: dto.validTo,
        user: dto.userId ? { connect: { id: dto.userId } } : undefined,
        activationLimit: dto.activationLimit,
      },
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.promoCode.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new BadRequestException('delete promocode fail! try again later');
    }
  }

  async validate(code: string, userId?: string) {
    const promoCode = await this.prisma.promoCode.findFirst({
      where: {
        code,
        active: true,
        validFrom: {
          lte: new Date(),
        },
        validTo: {
          gte: new Date(),
        },
        OR: [{ userId: userId || null }, { userId: null }],
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Invalid or expired promo code');
    }

    if (
      promoCode.activationLimit &&
      promoCode.activationCount >= promoCode.activationLimit
    ) {
      throw new NotFoundException(
        'Promo code has reached its activation limit',
      );
    }

    return promoCode;
  }
}
