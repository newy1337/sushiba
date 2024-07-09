import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all Orders' })
  @Get()
  async getAll() {
    return this.orderService.getAll();
  }

  @ApiOperation({ summary: 'Get my order' })
  @ApiBearerAuth()
  @Get('my')
  @Auth()
  async getByUser(@CurrentUser('id') userId: string) {
    return this.orderService.getByUser(userId);
  }

  @Auth({ optional: true })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make order' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: OrderDto, @CurrentUser('id') userId?: string) {
    return this.orderService.makeOrder(dto, userId);
  }

  @Auth()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Order Status' })
  @HttpCode(200)
  @Put('status/:id')
  @UsePipes(ValidationPipe)
  async updateStatus(
    @Body() dto: UpdateOrderStatusDto,
    @Param('id') id: string,
  ) {
    return this.orderService.updateStatus(dto, id);
  }

  @ApiOperation({ summary: 'Get stripe webhook' })
  @Post('webhook')
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.orderService.handleWebhook(payload, signature);
    return { received: true };
  }
}
