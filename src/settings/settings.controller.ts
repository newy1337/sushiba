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
import { SettingsService } from './settings.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateDayDto, UpdateDayHoursDto } from './dto/settings.dto';
import { Auth } from '../decorators/auth.decorator';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOperation({ summary: 'Get Working Hours' })
  @Get('days')
  async getAll() {
    return this.settingsService.getWorkingHours();
  }

  @ApiOperation({ summary: 'Update Working Hours by Day Id' })
  @Post('days')
  @Auth()
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async createDay(dto: CreateDayDto) {
    return this.settingsService.createDay(dto);
  }

  @ApiOperation({ summary: 'Update Working Hours by Day Id' })
  @Put('days/by-id/:id')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  async getById(@Param('id') id: string, dto: UpdateDayHoursDto) {
    return this.settingsService.updateDayHours(id, dto);
  }
}
