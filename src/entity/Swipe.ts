import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Swipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  liker: User;

  @ManyToOne(() => User)
  likee: User;

  @Column()
  time: Date;
}
