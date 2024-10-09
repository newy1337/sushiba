import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import * as process from 'node:process';
import Stripe from 'stripe';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { PromocodeService } from '../promocode/promocode.service';
import { sendSMS } from '../../utils/twilio';
import { isAvailableOrderNow } from './validators/custom/validate.order';
import { not } from 'rxjs/internal/util/not';

@Injectable()
export class OrderService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private promoCode: PromocodeService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async getAll(page: number = 1, pageSize: number = 10) {
    const pageNumber = Number(page);
    const pageSizeNumber = Number(pageSize);
    const skip = (pageNumber - 1) * pageSizeNumber;

    const totalCount = await this.prisma.order.count();
    const orders = await this.prisma.order.findMany({
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
      skip: skip,
      take: pageSizeNumber,
    });

    const ordersWithPrevious = await Promise.all(
      orders.map(async (order) => {
        const previousOrders = await this.prisma.order.findMany({
          where: {
            userId: order.userId,
            id: {
              not: order.id,
            },
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

        return {
          ...order,
          previousOrders, // Добавляем последние заказы того же пользователя
        };
      }),
    );

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      pagination: {
        totalCount,
        totalPages,
        pageSizeNumber,
        pageNumber,
      },
      orders: ordersWithPrevious,
    };
  }

  async getActive() {
    const activeOrders = await this.prisma.order.findMany({
      where: {
        status: {
          name: {
            notIn: ['Waiting for payment', 'Completed'],
          },
        },
      },
      include: {
        items: {
          include: {
            product: {},
          },
        },
      },
    });

    return await Promise.all(
      activeOrders.map(async (order) => {
        const previousOrders = await this.prisma.order.findMany({
          where: {
            userId: order.userId,
            id: {
              not: order.id,
            },
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

        return {
          ...order,
          previousOrders, // Добавляем последние заказы того же пользователя
        };
      }),
    );
  }

  async getById(id: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
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
    console.log(userId);
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
    if (!(await isAvailableOrderNow(this.prisma, dto))) {
      throw new HttpException('Not available time', HttpStatus.CONFLICT);
    }

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

    let discountAmount = 0;
    let discountPercentage = 0;

    if (dto.promoCode) {
      const promoCode = await this.promoCode.validate(dto.promoCode, userId);
      discountPercentage = promoCode.discount;
      discountAmount = (total * discountPercentage) / 100;
      total -= discountAmount;
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

    // const totalInCents = Math.round(total * 100);

    try {
      const lineItems = dto.items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const unitPrice = product.price * (1 - discountPercentage / 100);

        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(unitPrice * 100),
          },
          quantity: item.quantity,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        metadata: {
          orderId: order.id,
        },
        mode: 'payment',
        success_url: 'https://sushiba.eu/pt/myOrders?order=' + order.id,
        cancel_url: 'https://sushiba.eu/pt/cart',
      });

      return { sessionId: session.id };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async updateStatus(dto: UpdateOrderStatusDto, orderId: string) {
    interface OrderDetails {
      deliveryMethod?: string;
      preorder?: boolean;
    }
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
    try {
      let message = '';

      const details = order.details as OrderDetails;
      if (orderUpdated.status.name === 'Preparing') {
        if (details.preorder) {
          message = `Hey there!\n\nSushiba is here, thank you for your order (#${orderUpdated.shortId}).\n\nWe are working our magic to get everything ready, and your order will be ready to go as soon as possible.\nCheck your order status here: https://sushiba.eu/pt/myOrders?order=${order.id}`;
        } else {
          message = `Hey there!\n\nSushiba is here, thank you for your order (#${orderUpdated.shortId}).\n\nWe are working our magic to get everything ready, and your order will be ready to go as soon as possible.\nCheck your order status here: https://sushiba.eu/pt/myOrders?order=${order.id}`;
        }
      } else if (details.deliveryMethod === 'takeAway') {
        message = `Your order is ready and everything looks absolutely delicious!\n\nYou can pick it up in our cafe.\n\nOur address: Rua Artilharia 1, 98A, Sushiba.`;
      }
      await sendSMS(orderUpdated.user.phone, message);
    } catch (e) {
      console.error(e);
    }
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

    await this.prisma.order.update({
      where: { id: orderId },
      data: { statusId: 2 },
      include: {
        user: true,
      },
    });

    console.log(`Order ${orderId} has been updated to 'paid'.`);
    return { message: 'Order statuses updated' };
  }
}
