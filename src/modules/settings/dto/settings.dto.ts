import { IsString, Matches } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

export class CreateDayDto {
  @IsString()
  @ApiProperty()
  id: string;
  @IsString()
  @ApiProperty()
  day: string;
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'deliveryStart must be in HH:mm format',
  })
  @ApiPropertyOptional()
  deliveryStart: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'deliveryEnd must be in HH:mm format',
  })
  @ApiPropertyOptional()
  deliveryEnd?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'takeawayStart must be in HH:mm format',
  })
  @ApiPropertyOptional()
  takeawayStart?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'takeawayEnd must be in HH:mm format',
  })
  @ApiPropertyOptional()
  takeawayEnd?: string;
}

export class UpdateDayHoursDto extends PartialType(
  OmitType(CreateDayDto, ['day', 'id'] as const),
) {}
