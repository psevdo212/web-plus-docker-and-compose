import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CreateUserDto } from './create-user.dto';

export class SignupUserResponseDto extends CreateUserDto {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
