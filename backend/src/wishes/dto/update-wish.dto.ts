import {
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateWishDto {
  @IsString()
  @MinLength(1)
  @MaxLength(250)
  name?: string;

  @IsString()
  @IsUrl()
  link?: string;

  @IsString()
  @IsUrl()
  image?: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  price?: number;

  @IsString()
  description?: string;
}
