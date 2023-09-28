import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.authService.signUp(body);
  }

  @Post('/signin')
  async signIn(@Body() body: SigninUserDto): Promise<{ access_token: string }> {
    return this.authService.signIn(body);
  }
}
