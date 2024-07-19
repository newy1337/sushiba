import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTicketDto } from './dto/ticket.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

@Controller('tickets')
@ApiTags('Tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all tickets' })
  @Get()
  @HttpCode(200)
  async getAll() {
    return this.ticketsService.getAll();
  }
  @ApiOperation({ summary: 'Create Ticket' })
  @Post('create')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createTicket(dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update ticket status' })
  @Put('status/:id')
  @HttpCode(200)
  async updateStatus(@Param('id') id: string) {
    return this.ticketsService.updateStatus(id);
  }
}
