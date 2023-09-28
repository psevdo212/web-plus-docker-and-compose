import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(@InjectRepository(Wish) private wishRepo: Repository<Wish>) {}

  async createWish(body, userInfo) {
    const { name, link, image, description, price } = body;
    const newWish = await this.wishRepo.create({
      owner: userInfo.id,
      name,
      link,
      image,
      description,
      price,
      copied: 0,
      raised: 0,
    });

    try {
      await this.wishRepo.save(newWish);
      return newWish;
    } catch (e) {
      throw new InternalServerErrorException(`Ошибка сервера ${e}`);
    }
  }

  async getLastWish() {
    try {
      return await this.wishRepo.find({
        where: {},
        relations: {
          owner: {
            offers: true,
            wishes: true,
            wishlists: true,
          },
          offers: {
            user: true,
            item: true,
          },
        },
        order: { createdAt: 'DESC' },
        take: 40,
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getTopWish() {
    try {
      return await this.wishRepo.find({
        where: {},
        relations: {
          owner: {
            offers: true,
            wishes: true,
            wishlists: true,
          },
          offers: {
            user: true,
            item: true,
          },
        },
        order: { copied: 'ASC' },
        take: 10,
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async getWishById(id: number) {
    const wish = await this.wishRepo.findOne({
      where: { id },
      relations: {
        owner: {
          offers: true,
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });

    if (!wish) {
      throw new NotFoundException(`Подарка с id: ${id} не существует`);
    } else {
      return wish;
    }
  }

  async updateWish(user: User, id: number, body: UpdateWishDto) {
    const wish = await this.getWishById(id);

    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Редактирование запрещено');
    } else {
      try {
        await this.wishRepo.update({ id }, body);
        return this.getWishById(id);
      } catch (e) {
        throw new BadRequestException(`Запрос не сработал`);
      }
    }
  }

  async updateWishRaised(sponsoredWish: Wish, amount: number) {
    try {
      return this.wishRepo.update(
        { id: sponsoredWish.id },
        {
          raised: sponsoredWish.raised + amount,
        },
      );
    } catch {
      throw new BadRequestException(`Запрос не сработал`);
    }
  }

  async deleteWish(id: number, user: User) {
    const wishToDelete = await this.getWishById(id);
    if (wishToDelete.owner.id !== user.id) {
      throw new ForbiddenException('Разрешено удалять только свои подарки');
    } else {
      try {
        return await this.wishRepo.delete({ id });
      } catch (e) {
        throw new NotFoundException(`Ошибка сервера: ${e}`);
      }
    }
  }

  async copyWish(id: number, user: User) {
    const wish = await this.getWishById(id);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Разрешено копировать только чужие подарки');
    } else {
      try {
        const newWish = await this.createWish(
          { ...wish, copied: wish.copied + 1 },
          user,
        );
        return newWish;
      } catch (e) {
        throw new NotFoundException(`Ошибка сервера: ${e}`);
      }
    }
  }
}
