import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsOnlyOneSelected } from '../validators/deliverytype.validator';

export class OrderItemDto {
  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class OrderDetailsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  deliveryNow: boolean;
  @IsOnlyOneSelected({
    message: 'Either deliveryNow or preorder must be true, but not both',
  })
  @ApiProperty()
  @IsBoolean()
  @IsOnlyOneSelected({
    message: 'Either deliveryNow or preorder must be true, but not both',
  })
  preorder: boolean;

  @ApiPropertyOptional()
  @ValidateIf((o) => o.preorder === true)
  @IsNotEmpty()
  @IsString()
  preorderTime: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  howManyPeople: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deliveryMethod: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  comment: string;
}

export class OrderDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  promoCode: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: OrderDetailsDto })
  @ValidateNested()
  @Type(() => OrderDetailsDto)
  details: OrderDetailsDto;
}
