import { Module } from '@nestjs/common';
import { WishlistsController } from './wishlist.controller';
import { WishlistsService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
})
export class WishlistsModule {}
