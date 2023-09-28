import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(1, 64)
  @IsOptional()
  username?: string;

  @IsString()
  @Length(1, 200)
  @IsOptional()
  about?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  password?: string;
}
