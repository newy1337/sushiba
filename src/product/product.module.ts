import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [ProductService,PrismaService,CategoryService, JwtService],
})
export class ProductModule {}
