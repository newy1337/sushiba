import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/controllers/category/category.service';
import { JwtService } from '@nestjs/jwt';
import { AwsConfigService } from '../../utils/aws.config';

@Module({
  controllers: [ProductController],
  providers: [
    AwsConfigService,
    ProductService,
    PrismaService,
    CategoryService,
    JwtService,
  ],
})
export class ProductModule {}
