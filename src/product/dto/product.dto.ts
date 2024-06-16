import { IsBoolean, IsJSON, IsNumber, IsOptional, isString, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
  @IsString()
  @ApiProperty()
  image :string

  @IsString()
  @ApiProperty()
  description  : string

  @IsString()
  @ApiProperty()
  name: string

  @IsBoolean()
  @ApiProperty()
  active  : boolean

  @IsNumber()
  @ApiProperty()
  price : number

  @IsNumber()
  @ApiProperty()
  servingSize : number

  @IsNumber()
  @ApiProperty()
  weight : number

  @IsJSON()
  @ApiProperty()
  filling: any

  @IsJSON()
  @ApiProperty()
  allergens: any

  @IsString()
  @ApiProperty()
  categoryId: string
}


export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  image :string

  @IsString()
  @IsOptional()
  @ApiProperty()
  description  : string

  @IsString()
  @IsOptional()
  @ApiProperty()
  name: string

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  active  : boolean

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  price : number

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  servingSize : number

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  weight : number

  @IsJSON()
  @IsOptional()
  @ApiProperty()
  filling: any

  @IsJSON()
  @IsOptional()
  @ApiProperty()
  allergens: any

  @IsString()
  @ApiProperty()
  @IsOptional()
  categoryId: string
}