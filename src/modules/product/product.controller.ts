import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

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
  async create(
    @Body() dto: CreateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.create(dto, image);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update product' })
  @HttpCode(200)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.productService.update(id, dto, image);
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
