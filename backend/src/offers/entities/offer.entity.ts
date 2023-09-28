import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @CreateDateColumn()
  @IsNotEmpty()
  createdAt: Date;

  @UpdateDateColumn()
  @IsNotEmpty()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.id)
  item: Wish;

  @Column()
  @IsPositive()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;
}
