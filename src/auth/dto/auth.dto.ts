import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class sendOTP {
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;
}

export class verifyOTP {
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
