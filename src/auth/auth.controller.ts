import {
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, sendOTP, verifyOTP } from './dto/auth.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Send otp to Login User' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('sendOtp')
  async register(@Body() dto: sendOTP) {
    return this.authService.sendOTP(dto);
  }

  @ApiOperation({ summary: 'Verify otp' })
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('verifyOtp')
  async login(@Body() dto: verifyOTP) {
    return this.authService.verifyOTP(dto);
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
}
