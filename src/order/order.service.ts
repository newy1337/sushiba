import { Injectable, NotFoundException } from '@nestjs/common';
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
    const productIds = dto.items.map((item) => item.productId);

    // Проверяем наличие всех productId в базе данных
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    let total = dto.items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return acc + product.price * item.quantity;
    }, 0);

    if (!dto.promoCode) {
      const promoCode = await this.promoCode.validate(dto.promoCode, userId);
      total = total - promoCode.discount;
    }
    if (total < 0.5) {
      throw new Error('Amount must be at least $0.50 USD');
    }
    const orderDetailsJson = JSON.parse(JSON.stringify(dto.details));
    const order = await this.prisma.order.create({
      data: {
        orderDetails: orderDetailsJson,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: products.find((p) => p.id === item.productId).price,
          })),
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
