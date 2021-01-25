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

  @ManyToOne(() => User, {eager:true})
  liker: User;


  @ManyToOne(() => User, {eager:true})
  likee: User;

  @Column()
  time: Date;
}
