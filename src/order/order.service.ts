// @ts-ignore

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as process from 'node:process';
import Stripe from 'stripe';
import { OrderDto } from './dtos/order.dto';

@Injectable()
export class OrderService {
  private stripe: Stripe;
  constructor(private prisma: PrismaService) {
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
    const total = dto.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    if (total < 0.5) {
      throw new Error('Amount must be at least $0.50 USD');
    }
    const order = await this.prisma.order.create({
      data: {
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
