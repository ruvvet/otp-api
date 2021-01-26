import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Picture } from './Picture';
import { Swipe } from './Swipe';

@Entity()
export class User {
  @PrimaryColumn()
  discordId: string;

  @Column()
  discordUsername: string;

  @Column()
  discordAvatar: string;

  @Column({ select: false })
  accessToken: string;

  @Column({ select: false })
  refreshToken: string;

  @Column()
  expiry: Date;

  @Column({ nullable: true })
  displayName: string;

  @Column({ nullable: true })
  rank: string;

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @Column({ nullable: true })
  twitch: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  snapchat: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  spotify: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  reddit: string;

  @Column({ nullable: true })
  att: string;

  @Column({ nullable: true })
  def: string;

  @Column()
  lastActive: Date;

  @OneToMany(() => Swipe, (swipe) => swipe.liker)
  swipes: Swipe[];
}
