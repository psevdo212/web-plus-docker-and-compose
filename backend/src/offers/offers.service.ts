import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepo: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async createOffer(body: CreateOfferDto, user: User) {
    const { itemId, amount } = body;
    const sponsoredWish = await this.wishesService.getWishById(itemId);

    if (!sponsoredWish) {
      throw new NotFoundException('Подарок на который скидываются не найден');
    } else if (sponsoredWish.owner.id === user.id) {
      throw new ForbiddenException(
        'Нельзя отправлять деньги на собственные подарки',
      );
    } else if (sponsoredWish.raised + amount > sponsoredWish.price) {
      throw new BadRequestException('Укажите меньшую сумму для внесения');
    } else {
      const newOffer = await this.offerRepo.create({
        ...body,
        user,
        item: sponsoredWish,
      });

      try {
        await this.offerRepo.save(newOffer);
        await this.wishesService.updateWishRaised(sponsoredWish, amount);
      } catch {
        throw new InternalServerErrorException('Внутренняя ошибка сервера');
      }

      return newOffer;
    }
  }

  async getOffers(): Promise<Offer[]> {
    const offers = this.offerRepo.find({
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offers) {
      throw new NotFoundException('Предложения скинуться не найдено');
    } else {
      return offers;
    }
  }

  async getOffersById(id: number): Promise<Offer> {
    const offer = await this.offerRepo.findOne({
      where: { id: id },
      relations: {
        user: true,
        item: true,
      },
    });

    if (!offer) {
      throw new NotFoundException('Предложение скинуться не найдено');
    } else {
      return offer;
    }
  }
}
