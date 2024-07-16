import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../decorators/auth.decorator';
import { CurrentUser } from '../../decorators/user.decorator';
import { OrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import RequestWithRawBody from '../../interfaces/requestWithRawBody.interface';
import { Role } from '../../enums/roles.enum';
import { Roles } from '../../decorators/roles.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Get all Orders' })
  @Auth()
  @Roles(Role.ADMIN)
  @Get()
  async getAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return this.orderService.getAll(page, pageSize);
  }

  @ApiOperation({ summary: 'Get order by id' })
  @Get('by-id')
  async getById(@Param('id') id: string) {
    return this.orderService.getById(id);
  }
  @ApiOperation({ summary: 'Get my order' })
  @ApiBearerAuth()
  @Get('my')
  async getByUser(@CurrentUser('id') userId: string) {
    return this.orderService.getByUser(userId);
  }

  @Auth({ optional: true })
  @ApiBearerAuth()
  @Auth({ optional: true })
  @ApiOperation({ summary: 'Make order' })
  @HttpCode(200)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: OrderDto, @CurrentUser('id') userId?: string) {
    return this.orderService.makeOrder(dto, userId);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
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
    @Req() request: RequestWithRawBody,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = request.rawBody;
    await this.orderService.handleWebhook(payload, signature);
    return { received: true };
  }
}
