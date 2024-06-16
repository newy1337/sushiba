import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService,PrismaService,JwtService],
  exports: [CategoryModule]
})
export class CategoryModule {}
