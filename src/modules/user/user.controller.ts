import {
  Body,
  Controller,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../decorators/user.decorator';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/user.dto';
import { Auth } from '../../decorators/auth.decorator';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/roles.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Get me' })
  @Get('me')
  async getMe(@CurrentUser() user: User) {
    return this.userService.getMe(user);
  }

  @ApiBearerAuth()
  @Auth()
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'Update me' })
  @UsePipes(new ValidationPipe())
  @Put('')
  async updateMe(@Body() dto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.updateMe(dto, user);
  }
}
