import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { slugify } from 'src/utils/generate-slug';
import { returnProductObject } from './return-product.object';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async getAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
    });
  }

  async byId(id: string) {
    const products = await this.prisma.product.findUnique({
      where: { id: id },
      // select: returnProductObject,
    });

    if (!products) throw new NotFoundException('Product not found');
    return products;
  }
  async bySlug(slug: string) {
    const products = await this.prisma.product.findUnique({
      where: { slug: slug },
      // select: returnProductObject,
    });

    if (!products) throw new NotFoundException('Products not found');
    return products;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
      // select: returnProductObject,
    });

    if (!products) throw new NotFoundException('Products not found');
    return products;
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name);

    await this.checkSlugExist(slug);
    await this.checkCategoryExist(dto.categoryId);

    return this.prisma.product.create({
      data: {
        ...dto,
        slug: slugify(dto.name),
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    const slug = slugify(dto.name);

    console.log(slug);
    await this.checkSlugExist(slug);
    await this.checkCategoryExist(dto.categoryId);

    let dataToUpdate: any = {};

    if (dto.categoryId) {
      dataToUpdate.category = { connect: { id: dto.categoryId } };

      delete dataToUpdate.categoryId;
    }

    dataToUpdate = { ...dataToUpdate, ...dto };

    return this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async delete(id: string) {
    try {
      return await this.prisma.product.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      throw new BadRequestException(
        'Category have products, delete product and try again',
      );
    }
  }

  async checkSlugExist(slug: string) {
    const isExists = await this.prisma.product.findFirst({
      where: {
        slug: slug,
      },
    });

    if (isExists)
      throw new ConflictException('Product with same slug already exist');
  }

  async checkCategoryExist(categoryId: string) {
    const isExists = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!isExists) throw new ConflictException('Category not found');
  }
}
