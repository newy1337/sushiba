import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTicketDto } from './dto/ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.tickets.findMany();
  }

  async create(dto: CreateTicketDto) {
    return this.prisma.tickets.create({ data: dto });
  }

  async updateStatus(id: string) {
    return this.prisma.tickets.update({
      where: {
        id,
      },
      data: {
        status: 'Closed',
      },
    });
  }
}
