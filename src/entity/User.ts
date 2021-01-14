import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Picture } from './Picture';
import { Swipe } from './Swipe';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  discordId: string;

  @Column()
  discordUsername: string;

  @Column()
  discordAvatar: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @Column()
  expiry: Date;

  @Column()
  displayName: Date;

  @Column()
  rank: string;

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @Column()
  twitch: string;

  @Column()
  twitter: string;

  @Column()
  instagram: string;

  @Column()
  snapchat: string;

  @Column()
  tiktok: string;

  @Column()
  spotify: string;

  @Column()
  facebook: string;

  @Column()
  reddit: string;

  @Column()
  att: string;

  @Column()
  def: string;

  @OneToMany(() => Swipe, (swipe) => swipe.liker)
  swipes: Swipe[];
}
