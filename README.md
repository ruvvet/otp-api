# OTP-API

## Test it out at [otp-siege.herokuapp.com](https://otp-siege.herokuapp.com/)
#### An app that helps 🌈 Six Siege players find other 🌈 Six Siege players who are also looking for 🌈 Six Siege players...to play 🌈 Six Siege. And make friends.

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

```typescript
```