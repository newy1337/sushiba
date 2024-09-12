import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('products')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get All Products' })
  @Get()
  async getAll() {
    return this.productService.getAll();
  }

  @ApiOperation({ summary: 'Get products by id' })
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return await this.productService.byId(id);
  }

  @ApiOperation({ summary: 'Get products by slug' })
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.bySlug(slug);
  }

  @ApiOperation({ summary: 'Get products by category slug' })
  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    console.log(categorySlug);
    return this.productService.byCategory(categorySlug);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create product' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body('dto') dto: CreateProductDto,
    @UploadedFile()
    imageFile: Express.Multer.File,
  ) {
    console.log(dto);

    const dtoInstance = plainToInstance(CreateProductDto, dto);

    // Выполняем валидацию
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(getAllConstraints(errors));
    }

    return this.productService.create(dto, imageFile);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update product' })
  @HttpCode(200)
  @Put(':id')
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body('dto') dto: string,
    @UploadedFile()
    imageFile: Express.Multer.File,
  ) {
    const parsedDto: UpdateProductDto = JSON.parse(dto);

    const dtoInstance = plainToInstance(UpdateProductDto, parsedDto);

    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(getAllConstraints(errors));
    }
    return this.productService.update(id, parsedDto, imageFile);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete product' })
  @HttpCode(200)
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}

function getAllConstraints(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
}
