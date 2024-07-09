import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get me' })
  @ApiBearerAuth()
  @Get('me')
  @Auth()
  async getMe(@CurrentUser() user: User) {
    return this.userService.getMe(user);
  }

  @ApiOperation({ summary: 'Update me' })
  @ApiBearerAuth()
  @Put('')
  @Auth()
  async updateMe(@Body() dto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.updateMe(dto, user);
  }
}
