# OTP-API

## Test it out at [otp-siege.herokuapp.com](https://otp-siege.herokuapp.com/)<!-- omit in toc -->
#### An app that helps 🌈 Six Siege players find other 🌈 Six Siege players who are also looking for 🌈 Six Siege players...to play 🌈 Six Siege. And make friends.<!-- omit in toc -->

- [OTP-API](#otp-api)
    - [How it works:](#how-it-works)
    - [Tech](#tech)
    - [APIs](#apis)
- [HIGHLIGHTS](#highlights)
    - [TYPEORM](#typeorm)
    - [TypeORM complex queries](#typeorm-complex-queries)
        - [Getting unique chats](#getting-unique-chats)
        - [Getting matches](#getting-matches)

### How it works:
 - This is the api.
 - Go see [github.com/ruvvet/otp-ui](https://github.com/ruvvet/otp-ui)

### Tech
> - React
> - **⭐Express**
> - **⭐TypeORM**
> - **⭐Typescript**
> - **⭐Postgres**
> - **⭐Node**

### APIs
> - 🎮 Discord OAuth
> - ☁️ Cloudinary

# HIGHLIGHTS

### TYPEORM
TypeORM is an easy-to-use ORM that makes setting up, syncing, querying, and updating data feel easy.

```typescript
// An example entity that maps to the Swipe table in postgres
// We define the relationship and the native types
// And can further set restrictions inside each column
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

// ...
// creating the connection to the database
createConnection(connectionOptions as ConnectionOptions)
  .then(() => { //...

// ...
// create a new user
const userRepo = getRepository(User);
const findUser = await userRepo.findOne({
where: { discordId: userInfo.id },
});

const newUser = new User();
newUser.discordId = userInfo.id;
newUser.discordUsername = userInfo.username;
newUser.discordAvatar = userInfo.avatar || '';
newUser.accessToken = userAuth.access_token;
newUser.refreshToken = userAuth.refresh_token;
newUser.expiry = expiryDate;
newUser.lastActive = lastActive;
await userRepo.save(newUser);


// ...
// queries
  const findUser = await userRepo.findOne({
    where: { discordId: userInfo.id },
  });

```

### TypeORM complex queries

##### Getting unique chats
This query needed to find all the users who chatted with another user, taking into consideration situations where one user sends a message but there are no replies...etc.
```typescript
const convos = await chatRepo
    .createQueryBuilder('chat') // create a query with the chat table
    .leftJoin('chat.receiver', 'receiver') // left join on chat.receiver as receiver
    .leftJoin('chat.sender', 'sender') // left join on chat.sender as sender
    .select([
      'chat.receiver',
      'chat.senderId',
      'receiver.discordId',
      'receiver.discordUsername',
      'receiver.displayName',
      'receiver.discordAvatar',
      'sender.discordId',
      'sender.discordUsername',
      'sender.displayName',
      'sender.discordAvatar', // select these things
    .where('chat.receiver = :id', { id: req.userId }) // only select when reciver/sender is the Id
    .orWhere('chat.senderId = :id', { id: req.userId }) // only return fields where the sender is the ID sent
    .groupBy('chat.receiver')
    .addGroupBy('chat.senderId')
    .addGroupBy('receiver.discordId')
    .addGroupBy('sender.discordId')
    .getRawMany();
```


##### Getting matches
Finding matches means finding if one person swiped right on someone, and then finding if a mirrored entry exists in the table.

```typescript
  const swipeRepo = getRepository(Swipe);
  const matches = await swipeRepo
    .createQueryBuilder('swipe') // create query with swipe table
    .where('swipe.likee = :user', { user: req.userId }) // find entries where the userId matches
    .andWhere((qb) => { // create a subquery
      const subQuery = qb
        .subQuery()
        .select()
        .from(Swipe, 'swipeInner') // select all other swipes where
        .where('swipeInner.likee = swipe.liker') // they mirror each other
        .andWhere('swipeInner.liker = swipe.likee')
        .getQuery();
      return `EXISTS ${subQuery}`;
    })
    .leftJoinAndSelect('swipe.liker', 'liker')
    .getMany();
```