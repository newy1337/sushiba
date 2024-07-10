import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDayDto, UpdateDayHoursDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getWorkingHours() {
    return this.prisma.workingHours.findMany();
  }

  async createDay(dto: CreateDayDto) {
    return this.prisma.workingHours.create({
      data: dto,
    });
  }

  async updateDayHours(id: string, dto: UpdateDayHoursDto) {
    const existingRecord = await this.prisma.workingHours.findUnique({
      where: {
        id,
      },
    });

    if (!existingRecord) {
      throw new NotFoundException(`WorkingHours  with id ${id} not found`);
    }

    const updatedDay = await this.prisma.workingHours.update({
      where: {
        id,
      },
      data: dto,
    });

    return { message: 'Working time is updated', day: updatedDay };
  }
}
