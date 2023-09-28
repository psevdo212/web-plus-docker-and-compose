import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  @IsNotEmpty()
  id: number;

  @CreateDateColumn()
  @IsNotEmpty()
  createdAt: Date;

  @UpdateDateColumn()
  @IsNotEmpty()
  updatedAt: Date;

  @Column()
  @IsNotEmpty()
  @Length(2, 250)
  name: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @Column()
  @IsUrl()
  @IsNotEmpty()
  image: string;

  @Column()
  @Min(1)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column()
  @Min(1)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  @Column()
  @IsPositive()
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
