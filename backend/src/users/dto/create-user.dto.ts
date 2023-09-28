import {
  IsEmail,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(0)
  @MaxLength(200)
  about?: string;

  @IsString()
  @IsUrl({ default: 'https://i.pravatar.cc/150?img=3' })
  avatar?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  password: string;
}
