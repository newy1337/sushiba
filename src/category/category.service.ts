import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { returnCategoryObject } from "./return-category.object";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { slugify } from "src/utils/generate-slug";

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async getAll() {
    return await this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }

  async byId(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException("Category not found");
    return category;
  }
  async bySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug: slug },
      select: returnCategoryObject,
    });

    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    console.log(id);

    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: slugify(dto.name),
      },
    });
  }

  async delete(id: string) {
    console.log(id);

    try {
      return await this.prisma.category.delete({
        where: {
          id,
        },
      });
    } catch (e) {
       throw new BadRequestException('Category have products, delete product and try again')
      }
  }
}
