import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { OrderDto } from './dtos/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all Orders' })
  @Get()
  async getAll() {
    return this.orderService.getAll();
  }

  @ApiOperation({ summary: 'Get order  by user id' })
  @ApiBearerAuth()
  @Get('by-user')
  @Auth()
  async getByUser(@CurrentUser('id') userId: string) {
    return this.orderService.getByUser(userId);
  }

  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make order' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: OrderDto, @CurrentUser('id') userId: string) {
    return this.orderService.makeOrder(dto, userId);
  }
}
