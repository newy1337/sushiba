import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromoCodeDto {
  @IsString()
  code: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active: boolean = false;

  @IsInt()
  @ApiProperty()
  @Min(0)
  @Max(100)
  discount: number;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  validFrom: Date;

  @IsDate()
  @ApiProperty()
  @Type(() => Date)
  validTo: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  userId?: string;

  @IsInt()
  @ApiProperty()
  @Min(0)
  activationLimit: number; // Максимальное количество активаций
}

export class UpdatePromoCodeDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  code?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active?: boolean;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  @Min(0)
  @Max(100)
  discount?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  @Type(() => Date)
  validFrom?: Date;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  @Type(() => Date)
  validTo?: Date;

  @IsString()
  @IsOptional()
  @ApiProperty()
  userId?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty()
  @Min(0)
  activationLimit: number;
}
