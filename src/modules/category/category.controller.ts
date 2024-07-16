import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  async getAll() {
    return this.categoryService.getAll();
  }

  @ApiOperation({ summary: 'Get categories by id' })
  @Get('by-id/:id')
  async getById(@Param('id') id: string) {
    return this.categoryService.byId(id);
  }

  @ApiOperation({ summary: 'Get categories by slug' })
  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.categoryService.bySlug(slug);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create category' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @ApiOperation({ summary: 'Update category' })
  @Auth()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete Category' })
  @Auth()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string) {
    return this.categoryService.delete(id);
  }
}
