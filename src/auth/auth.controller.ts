import {Body,HttpCode, UsePipes, ValidationPipe, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, RegisterDto } from './dto/auth.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register User'})
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }


  @ApiOperation({ summary: 'Login User'})
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }



  @ApiOperation({ summary: 'User Token Refresh'})
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @ApiBearerAuth()
  @Post('token/refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken)
  }
}


