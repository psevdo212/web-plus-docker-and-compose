import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwtGuard';
import { Wish } from './entities/wish.entity';
import { DeleteResult } from 'typeorm';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  postWish(@AuthUser() user: User, @Body() body: CreateWishDto): Promise<Wish> {
    return this.wishesService.createWish(body, user);
  }

  @Get('/last')
  getLastWishInfo(): Promise<Wish[]> {
    return this.wishesService.getLastWish();
  }

  @Get('/top')
  getTopWishInfo(): Promise<Wish[]> {
    return this.wishesService.getTopWish();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishByIdInfo(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.getWishById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWishById(
    @AuthUser() user: User,
    @Param('id') id: number,
    body: UpdateWishDto,
  ): Promise<Wish> {
    return this.wishesService.updateWish(user, id, body);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWishById(
    @AuthUser() user: User,
    @Param('id') id: number,
  ): Promise<DeleteResult> {
    return this.wishesService.deleteWish(id, user);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWishById(@AuthUser() user: User, @Param('id') id: number): Promise<Wish> {
    return this.wishesService.copyWish(id, user);
  }
}
