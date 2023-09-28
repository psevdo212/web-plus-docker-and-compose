import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/helpers/hash';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getProfile(username: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { username },
      select: {
        username: true,
        about: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        email: true,
      },
      relations: {
        wishes: true,
        offers: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Ошибка загрузки профиля');
    } else {
      return user;
    }
  }

  async updateProfile(user: User, userData: Partial<User>): Promise<User> {
    const { password } = userData;

    if (password) {
      const hashedPassword = await hashPassword(password);
      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser = await this.userRepo.update(user.id, userData);

    if (!updatedUser) {
      throw new BadRequestException('Ошибка запроса на изменение профиля');
    } else {
      return this.getUserById(user.id);
    }
  }

  async getProfileWishes(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: ['wishes'],
    });

    if (!user) {
      throw new NotFoundException('Список желаний пуст');
    } else {
      return user.wishes;
    }
  }

  async getUser(username: string) {
    const user = await this.userRepo.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException(`Пользователь ${username} не существует`);
    } else {
      return user;
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id: ${id} не существует`);
    } else {
      return user;
    }
  }

  async getUserWishes(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['wishes'],
    });

    if (!user) {
      throw new NotFoundException(`Пользователя ${username} не существует`);
    } else {
      return user.wishes;
    }
  }

  async findUser({ query }: { query: string }): Promise<User[]> {
    const user = await this.userRepo.find({ where: { username: query } });

    if (!user) {
      throw new NotFoundException(`Пользователя ${query} не существует`);
    } else {
      return user;
    }
  }
}
