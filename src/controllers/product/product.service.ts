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

  async create(dto: CreateProductDto, imageFile: Express.Multer.File) {
    const slug = slugify(dto.name);

    await this.checkSlugExist(slug);
    await this.checkCategoryExist(dto.categoryId);
    const url = await this.uploadS3(slug, imageFile);

    return this.prisma.product.create({
      data: {
        image: url,
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
