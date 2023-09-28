import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { compareHash, hashPassword } from 'src/helpers/hash';
import { duplicateKeyStatusCode } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<User> {
    const { username, about, email, password, avatar } = createUserDto;
    const hashedPassword = await hashPassword(password);
    const newUser = this.userRepo.create({
      username,
      about,
      email,
      password: hashedPassword,
      avatar,
    });

    try {
      await this.userRepo.save(newUser);
      return newUser;
    } catch (e) {
      if (e.code === duplicateKeyStatusCode) {
        throw new ConflictException(
          'Пользователь с указанным email уже существует',
        );
      } else {
        throw new InternalServerErrorException('Внутренняя ошибка сервера');
      }
    }
  }

  async signIn(
    signinUserDto: SigninUserDto,
  ): Promise<{ access_token: string }> {
    const { username, password } = signinUserDto;
    const user = await this.usersService.getUser(username);

    if (user && (await compareHash(password, user.password))) {
      const access_token: string = await this.jwtService.sign(
        { userId: user.id },
        { secret: `${process.env.JWT_SECRET}` },
      );

      return { access_token };
    } else {
      throw new UnauthorizedException('Проверьте логин или пароль');
    }
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUser(username);
    if (user && (await compareHash(password, user.password))) {
      const { password, ...result } = user;

      return user;
    }

    return null;
  }
}
