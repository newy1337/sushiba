import { Module } from '@nestjs/common';
import { PromocodeService } from './promocode.service';
import { PromocodeController } from './promocode.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [PromocodeController],
  providers: [PromocodeService, PrismaService],
})
export class PromocodeModule {}
