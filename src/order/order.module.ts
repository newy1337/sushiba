import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from '../prisma.service';
import { PromocodeService } from '../promocode/promocode.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, PromocodeService],
})
export class OrderModule {}
