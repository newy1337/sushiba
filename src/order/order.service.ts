// @ts-ignore

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as process from 'node:process';
import Stripe from 'stripe';
import { OrderDto } from './dtos/order.dto';
import { PromocodeService } from '../promocode/promocode.service';

@Injectable()
export class OrderService {
  private stripe: Stripe;
  constructor(
    private prisma: PrismaService,
    private promoCode: PromocodeService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async getAll() {
    return this.prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {},
          },
        },
      },
    });
  }

  async getByUser(userId: string) {
    return this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: {
          include: {
            product: {},
          },
        },
      },
    });
  }
  async makeOrder(dto: OrderDto, userId: string) {
    let total = dto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    if (!dto.promoCode) {
      const promoCode = await this.promoCode.validate(dto.promoCode, userId);
      total = total - promoCode.discount;
    }
    if (total < 0.5) {
      throw new Error('Amount must be at least $0.50 USD');
    }
    const order = await this.prisma.order.create({
      data: {
        orderDetails: dto.details[0],
        items: {
          create: dto.items,
        },
        total,
        user: {
          connect: { id: userId },
        },
      },
    });

    const totalInCents = Math.round(total * 100);

    const paymentIntents = await this.stripe.paymentIntents.create({
      amount: totalInCents,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      description: 'Order #' + order.id,
    });
    return { clientSecret: paymentIntents.client_secret };
  }
}
