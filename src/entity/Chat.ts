import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  receiver: string;

  @Column()
  sender: string;

  @Column()
  date: Date;

  @Column("text", {nullable:true})
  msg: string;
}




