import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @IsOptional()
  @ApiProperty()
  image: string;

  @IsString()
  @ApiProperty()
  name: string;

  @IsBoolean()
  @ApiProperty()
  active: boolean;

  @IsNumber()
  @ApiProperty()
  price: number;

  @IsNumber()
  @ApiProperty()
  servingSize: number;

  @IsNumber()
  @ApiProperty()
  weight: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsArray()
  @ApiProperty()
  filling: [];

  @IsArray()
  @ApiProperty()
  allergens: [];

  @IsString()
  @ApiProperty()
  categoryId: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  image: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price: number;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  servingSize: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  weight: number;

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  filling: [];

  @IsArray()
  @ApiPropertyOptional()
  @IsOptional()
  allergens: [];

  categoryId: string;
}
