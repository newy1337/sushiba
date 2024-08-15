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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dto/promocode.dto';
import { CurrentUser } from '../../decorators/user.decorator';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

@Controller('promocodes')
@ApiTags('Promo codes')
export class PromocodeController {
  constructor(private readonly promocodeService: PromocodeService) {}

  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all promo' })
  @ApiBearerAuth()
  @Get()
  async getAll() {
    return this.promocodeService.getAll();
  }

  @Auth()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get my promo' })
  @Get('my')
  @ApiBearerAuth()
  async getMy(@CurrentUser('id') userId?: string) {
    return this.promocodeService.getMy(userId);
  }

  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update  promo code' })
  @ApiBearerAuth()
  @HttpCode(200)
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Param('id') id: string, @Body() dto: UpdatePromoCodeDto) {
    return this.promocodeService.update(id, dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create promo code' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: CreatePromoCodeDto) {
    return this.promocodeService.create(dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'delete Promo code' })
  @HttpCode(200)
  @Delete(':id')
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string) {
    return this.promocodeService.delete(id);
  }

  @ApiOperation({ summary: 'Validate promo code' })
  @ApiBearerAuth()
  @Auth({ optional: true })
  @HttpCode(200)
  @Post('validate')
  @UsePipes(ValidationPipe)
  @ApiBody({
    description: 'Promo code to validate',
    schema: { type: 'object', properties: { code: { type: 'string' } } },
  })
  async validate(
    @Body('code') code: string,
    @CurrentUser('id') userId?: string,
  ) {
    return this.promocodeService.validate(code, userId);
  }
}
