import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  index: number;
}
export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  name: string;
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  index: number;
}
