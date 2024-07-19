import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsString()
  message: string;
}
