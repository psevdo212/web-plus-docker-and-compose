import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
  ) {}

  async getWishlists() {
    const wishlists = await this.wishlistRepo.find({
      relations: {
        owner: true,
      },
    });

    if (!wishlists) {
      throw new NotFoundException(`Вишлисты не найдены`);
    } else {
      return wishlists;
    }
  }

  async createWishlist(body: CreateWishlistDto, user: User) {
    const { name, image, itemsId } = body;
    const wishItems = itemsId.map((id: number) => ({ id } as Wish));

    const newWishlist = await this.wishlistRepo.create({
      owner: user,
      name,
      image,
      items: wishItems,
    });

    try {
      const savedWishlist = await this.wishlistRepo.save(newWishlist);
      return this.getWishlistById(savedWishlist.id);
    } catch {
      throw new BadRequestException(`Запрос не сработал`);
    }
  }

  async getWishlistById(id: number) {
    const wishlist = await this.wishlistRepo.findOne({
      where: { id },
      relations: {
        items: true,
        owner: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(`Вишлист не найден`);
    } else {
      return wishlist;
    }
  }

  async updateWishlist(id: number, body: UpdateWishlistDto, user: User) {
    const wishlist = await this.getWishlistById(id);
    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException('Редактирование чужих вишлистов запрещено');
    } else {
      try {
        await this.wishlistRepo.update({ id }, body);
        return this.getWishlistById(id);
      } catch (e) {
        throw new BadRequestException(`Запрос не сработал: ${e}`);
      }
    }
  }

  async deleteWishlist(id: number) {
    try {
      return await this.wishlistRepo.delete({ id });
    } catch (e) {
      throw new NotFoundException(`Ошибка сервера: ${e}`);
    }
  }
}
