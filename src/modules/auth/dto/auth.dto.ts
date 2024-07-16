import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class sendOTPDto {
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;
}

export class verifyUserDto {
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;
  @ApiProperty()
  @IsString()
  otp: string;
}

export class RefreshTokenDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}

export class CompleteAuthDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsEmail()
  email: string;
}
