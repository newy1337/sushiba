import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
        return await this.prisma.product.findMany({
          include: {
            category: true,
          },
        })
      }

      async byId(id: string) {
        const products =  await this.prisma.product.findUnique({where: {id: id}, select: returnProductObject})

        if(!products) throw new  NotFoundException('Product not found')
        return products      
      }
      async bySlug(slug: string) {
        const products =  await this.prisma.product.findUnique({where: {slug: slug}, select: returnProductObject})

        if(!products) throw new NotFoundException('Products not found')
        return products      
      }


      async byCategory(categorySlug: string) {
        const products =  await this.prisma.product.findMany({where: { category: {slug: categorySlug}}, select: returnProductObject})

        if(!products) throw new NotFoundException('Products not found')
        return products      
      }

      async create(dto:CreateProductDto) {
        
        const slug = slugify(dto.name);

        this.checkSlugExist(slug);
        this.checkCategoryExist(dto.categoryId)


        return await this.prisma.product.create({
            data: {
                ...dto,
                slug: slugify(dto.name)
                
            }
        })
      }

      async update(id: string,dto: UpdateProductDto) {

        const slug = slugify(dto.name);


        this.checkSlugExist(slug);
        this.checkCategoryExist(dto.categoryId)
        console.log(id)
        let dataToUpdate : any = {}

        if(dto.categoryId) {
          dataToUpdate.category = { connect: { id: dto.categoryId } };
    
          delete dataToUpdate.categoryId
        }

        dataToUpdate = {...dataToUpdate,...dto}

        return await this.prisma.product.update({
          where: { id },
          data: dataToUpdate
        });
      
    }

      async delete(id: string) {
        return await this.prisma.product.delete({
            where: {
                id
            }
        })
      }



      async checkSlugExist(slug : string) {

        const isExists =  await this.prisma.product.findUnique({
          where: {
            'slug' : slug
          }
        })


        if(isExists) {
          if(isExists) throw new ConflictException('Product with same slug already exist')
        }

      }


      async checkCategoryExist(categoryId : string) {

        const isExists =  await this.prisma.category.findFirst({
          where: {
            'id' : categoryId
          }
        })



        if(isExists) {
          if(isExists) throw new ConflictException('Category not found')
        }

      }

}
