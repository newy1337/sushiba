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
import { PromocodeService } from './promocode.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dto/promocode.dto';
import { CurrentUser } from '../../decorators/user.decorator';

@Controller('promocodes')
@ApiTags('Promo codes')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) {}

  @ApiOperation({ summary: 'Get all promo' })
  @Get()
  async getAll() {
    return this.promocodeService.getAll();
  }

  @ApiOperation({ summary: 'Get my promo' })
  @Get('my')
  @Auth()
  @ApiBearerAuth()
  async getMy(@CurrentUser('id') userId?: string) {
    return this.promocodeService.getMy(userId);
  }

  @ApiOperation({ summary: 'Update  promo code' })
  @Auth()
  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: string, @Body() dto: UpdatePromoCodeDto) {
    return this.promocodeService.update(id, dto);
  }

  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create promo code' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreatePromoCodeDto) {
    return this.promocodeService.create(dto);
  }

  @ApiOperation({ summary: 'delete Promo code' })
  @Auth()
  @ApiBearerAuth()
  @HttpCode(200)
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string) {
    return this.promocodeService.delete(id);
  }

  @ApiOperation({ summary: 'Validate promo code' })
  @ApiBearerAuth()
  @HttpCode(200)
  @Post('validate')
  @UsePipes(ValidationPipe)
  async validate(
    @Param('code') code: string,
    @CurrentUser('id') userId?: string,
  ) {
    console.log(1);
    return this.promocodeService.validate(code, userId);
  }
}
