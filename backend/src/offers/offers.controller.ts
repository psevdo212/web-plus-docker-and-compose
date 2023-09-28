import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { JwtGuard } from 'src/auth/jwtGuard';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard)
  @Post()
  createProfileOffer(@AuthUser() user: User, @Body() body: CreateOfferDto) {
    return this.offersService.createOffer(body, user);
  }

  @UseGuards(JwtGuard)
  @Get()
  getOffersInfo(): Promise<Offer[]> {
    return this.offersService.getOffers();
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getOffersByIdInfo(@Param('id') id: string): Promise<Offer> {
    return this.offersService.getOffersById(parseInt(id));
  }
}
