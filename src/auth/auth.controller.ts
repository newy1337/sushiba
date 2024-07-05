import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CompleteAuthDto,
  RefreshTokenDto,
  sendOTPDto,
  verifyUserDto,
} from './dto/auth.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Send otp to Login User' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('sendOtp')
  async register(@Body() dto: sendOTPDto) {
    return this.authService.sendOTP(dto);
  }

  @ApiOperation({ summary: 'Verify User' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('verifyUser')
  async login(@Body() dto: verifyUserDto) {
    return this.authService.verifyUser(dto);
  }

  @ApiOperation({ summary: 'User Token Refresh' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @ApiBearerAuth()
  @Post('token/refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @ApiOperation({ summary: 'User Token Refresh' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @ApiBearerAuth()
  @Post('complete')
  async completeAuth(
    @Body() dto: CompleteAuthDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.authService.completeAuth(dto, userId);
  }
}
