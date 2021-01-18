import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Picture {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=>User)
    user: User;

    @Column()
    url: string;

    @Column()
    index: number;
}