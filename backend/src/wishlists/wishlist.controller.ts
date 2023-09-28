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
import { WishlistsService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/jwtGuard';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/decorators/user.decorator';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult } from 'typeorm';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Get()
  getWishlistsInfo(): Promise<Wishlist[]> {
    return this.wishlistsService.getWishlists();
  }

  @UseGuards(JwtGuard)
  @Post()
  createProfileWishlist(
    @AuthUser() user: User,
    @Body() body: CreateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.createWishlist(body, user);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getWishlistInfoById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.getWishlistById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWishlistById(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() body: UpdateWishlistDto,
  ): Promise<Wishlist> {
    return this.wishlistsService.updateWishlist(id, body, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWishlistById(@Param('id') id: number): Promise<DeleteResult> {
    return this.wishlistsService.deleteWishlist(id);
  }
}
