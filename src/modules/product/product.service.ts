import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { slugify } from 'src/utils/generate-slug';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { AwsConfigService } from '../../utils/aws.config';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly awsConfigService: AwsConfigService,
    private config: ConfigService,
  ) {}

  async getAll() {
    // Используем await для получения данных
    const products = await this.prisma.product.findMany({
      include: {
        category: true,
      },
    });

    if (products.length === 0) throw new NotFoundException('Products is empty');

    return products.map((product) => ({
      ...product,
      priceWithDiscount: product.price - product.discount,
    }));
  }

  async byId(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      // select: returnProductObject,
    });

    if (!product) throw new NotFoundException('Product not found');
    const priceWithDiscount = product.price - product.discount;

    return {
      ...product,
      priceWithDiscount,
    };
  }
  async bySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug: slug },
      // select: returnProductObject,
    });

    if (!product) throw new NotFoundException('Products not found');
    const priceWithDiscount = product.price - product.discount;

    return {
      ...product,
      priceWithDiscount,
    };
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: { category: { slug: categorySlug } },
    });

    if (products.length === 0)
      throw new NotFoundException('Products not found');

    return products.map((product) => ({
      ...product,
      priceWithDiscount: product.price - product.discount,
    }));
  }

  async create(dto: CreateProductDto, imageFile?: Express.Multer.File) {
    const slug = slugify(dto.name);

    await this.checkSlugExist(slug);
    await this.checkCategoryExist(dto.categoryId);
    if (imageFile) {
      dto.image = await this.uploadS3(slugify(dto.name), imageFile);
    }

    const { categoryId, extras, ...productData } = dto;
    const formattedExtras = extras ? JSON.stringify(extras) : null;
    return this.prisma.product.create({
      data: {
        ...productData,
        slug: slugify(dto.name),
        category: {
          connect: { id: categoryId },
        },
        extras: formattedExtras,
      },
    });
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    imageFile?: Express.Multer.File,
  ) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new Error(`Product with id ${id} not found.`);
    }
    if (dto.name) {
      const slug = slugify(dto.name);

      await this.checkSlugExist(slug);
      await this.checkCategoryExist(dto.categoryId);
    }

    let dataToUpdate: any = { ...dto };

    if (dto.categoryId) {
      dataToUpdate.category = { connect: { id: dto.categoryId } };
    }

    dataToUpdate = { ...dataToUpdate, ...dto };
    delete dataToUpdate.categoryId;

    if (imageFile) {
      dataToUpdate.image = await this.uploadS3(slugify(dto.name), imageFile);
    }

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

  private async uploadS3(slug: string, image: Express.Multer.File) {
    const s3Client = this.awsConfigService.getS3Client();
    const patch = `products/${slug}/${image.originalname}`;
    const bucket = <string>'sushiba-bucket';

    const uploadParams: PutObjectCommandInput = {
      Bucket: bucket,
      Key: patch,
      Body: image.buffer,
      ACL: 'public-read',
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${bucket}.s3.amazonaws.com/${patch}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw new Error('Failed to upload image to S3');
    }
  }
}
