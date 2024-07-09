import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as process from 'node:process';
import Stripe from 'stripe';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { PromocodeService } from '../promocode/promocode.service';
import { sendSMS } from '../utils/twilio';

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

  async makeOrder(dto: OrderDto, userId?: string) {
    if (!userId) {
      let user = await this.prisma.user.findUnique({
        where: {
          phone: dto.details.phone,
        },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phone: dto.details.phone,
          },
        });
      }

      userId = user.id;
    }
    const productIds = dto.items.map((item) => item.productId);

    // Проверяем наличие всех productId в базе данных
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // if (products.length !== productIds.length) {
    //   throw new NotFoundException('One or more products not found');
    // }

    let total = dto.items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return acc + product.price * item.quantity;
    }, 0);

    if (dto.promoCode !== undefined) {
      const promoCode = await this.promoCode.validate(dto.promoCode, userId);
      total -= promoCode.discount;
    }
    if (total < 0.5) {
      throw new Error('Amount must be at least $0.50 USD');
    }
    const orderDetailsJson = JSON.parse(JSON.stringify(dto.details));
    const order = await this.prisma.order.create({
      data: {
        details: orderDetailsJson,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price:
              products.find((p) => p.id === item.productId).price *
              item.quantity,
          })),
        },
        total,
        user: {
          connect: { id: userId },
        },
      },
    });

    const totalInCents = Math.round(total * 100);

    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'multibanco'],
        line_items: dto.items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: products.find((p) => p.id === item.productId).name,
            },
            unit_amount:
              products.find((p) => p.id === item.productId).price * 100,
          },
          quantity: item.quantity,
        })),
        metadata: {
          orderId: order.id,
        },
        mode: 'payment',
        // payment_intent_data: {
        //   setup_future_usage: 'on_session',
        // },
        success_url: 'https://yourdomain.com/success',
        cancel_url: 'https://yourdomain.com/cancel',
      });
      return { sessionId: session.id };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async updateStatus(dto: UpdateOrderStatusDto, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const orderUpdated = await this.prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        statusId: dto.statusId,
      },
      include: {
        user: true,
        status: true,
      },
    });
    console.log(orderUpdated);
    await sendSMS(
      orderUpdated.user.phone,
      'You order: ' +
        orderUpdated.id +
        ' changed status to: ' +
        orderUpdated.status.name,
    );
    return { message: 'Order statuses updated' };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_status === 'paid') {
          await this.handleCheckoutSessionPaymentCompleted(session);
        }
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  private async handleCheckoutSessionPaymentCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const orderId = session.metadata.orderId;

    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { statusId: 2 },
      include: {
        user: true,
      },
    });

    await sendSMS(order.user.phone, 'You order: ' + orderId + ' created!');

    console.log(`Order ${orderId} has been updated to 'paid'.`);
    return { message: 'Order statuses updated' };
  }
}
