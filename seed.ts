import { createConnection, getRepository } from 'typeorm';
import { User } from './src/entity/User';
import { Picture } from './src/entity/Picture';
import { Swipe } from './src/entity/Swipe';
import { Chat } from './src/entity/Chat';

async function seedPoki() {
  const userRepo = getRepository(User);

  const pokimane = new User();
  pokimane.discordId = '123Poki';
  pokimane.discordUsername = 'Pokimane';
  pokimane.discordAvatar = 'www.discord.com/something.png';
  pokimane.accessToken = '123Poki';
  pokimane.refreshToken = '123Poki';
  pokimane.expiry = new Date();
  pokimane.displayName = 'Poki';
  pokimane.rank = 'Silver I';
  pokimane.twitch = 'Pokimane';
  pokimane.twitter = 'Pokimane';
  pokimane.instagram = 'Pokimane';
  pokimane.snapchat = 'Pokimane';
  pokimane.tiktok = 'Pokimane';
  pokimane.spotify = 'Pokimane';
  pokimane.facebook = 'Pokimane';
  pokimane.reddit = 'Pokimane';
  pokimane.att = 'Dokkaebi';
  pokimane.def = 'Caveira';
  pokimane.lastActive = new Date();
  await userRepo.save(pokimane);

  const picRepo = getRepository(Picture);

  const newPokiPic1 = new Picture();
  newPokiPic1.user = pokimane;
  newPokiPic1.url =
    'https://specials-images.forbesimg.com/imageserve/5f5f55887d9eec237a586841/960x0.jpg';
  newPokiPic1.index = 'picOne';

  const newPokiPic2 = new Picture();
  newPokiPic2.user = pokimane;
  newPokiPic2.url =
    'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg';
  newPokiPic2.index = 'picTwo';

  const newPokiPic3 = new Picture();
  newPokiPic3.user = pokimane;
  newPokiPic3.url =
    'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg';
  newPokiPic3.index = 'picThree';

  await picRepo.save([newPokiPic1, newPokiPic2, newPokiPic3]);
}

async function seedShroud() {
  const userRepo = getRepository(User);

  const shroud = new User();
  shroud.discordId = '123Shroud';
  shroud.discordUsername = 'shroud';
  shroud.discordAvatar = 'www.discord.com/something.png';
  shroud.accessToken = '123S';
  shroud.refreshToken = '123S';
  shroud.expiry = new Date();
  shroud.displayName = 'Poki';
  shroud.rank = 'Champion';
  shroud.twitch = 'shroud';
  shroud.twitter = 'shroud';
  shroud.instagram = 'shroud';
  shroud.reddit = 'shroud';
  shroud.att = 'Iana';
  shroud.def = 'Doc';
  shroud.lastActive = new Date();
  await userRepo.save(shroud);

  const picRepo = getRepository(Picture);

  const newShroudPic1 = new Picture();
  newShroudPic1.user = shroud;
  newShroudPic1.url =
    'https://boundingintocomics.com/wp-content/uploads/2019/10/2019.10.25-05.14-boundingintocomics-5db32d840ef42.png';
  newShroudPic1.index = 'picOne';

  const newShroudPic2 = new Picture();
  newShroudPic2.user = shroud;
  newShroudPic2.url =
    'https://www.videogameschronicle.com/files/2019/10/shroud.jpg';
  newShroudPic2.index = 'picTwo';

  const newShroudPic3 = new Picture();
  newShroudPic3.user = shroud;
  newShroudPic3.url =
    'https://cdn1.dotesports.com/wp-content/uploads/2019/02/03090608/be4dfdefcc8e26b44dfa282f585f20a3.jpg';
  newShroudPic3.index = 'picThree';

  await picRepo.save([newShroudPic1, newShroudPic2, newShroudPic3]);
}

async function seedSwipes() {
  const userRepo = getRepository(User);
  const swipeRepo = getRepository(Swipe);

  const me = await userRepo.findOne({
    where: { discordId: '101217049287622656' },
  });

  const other = await userRepo.findOne({
    where: { discordId: '123Poki' },
  });

  const newSwipe = new Swipe();
  newSwipe.liker = other as User;
  newSwipe.likee = me as User;
  newSwipe.time = new Date();
  await swipeRepo.save(newSwipe);
}

async function seedJennyChat() {
  const chatRepo = getRepository(Chat);

  // const newChat = new Chat();
  // newChat.receiverId = '123Poki';
  // newChat.senderId = '101217049287622656';
  // newChat.date = new Date();
  // newChat.msg = 'hey there';

  // const newChat1 = new Chat();
  // newChat1.receiverId = '123Poki';
  // newChat1.senderId = '101217049287622656';
  // newChat1.date = new Date();
  // newChat1.msg = 'im subscribed to you';

  // const newChat2 = new Chat();
  // newChat2.receiverId = '123Poki';
  // newChat2.senderId = '101217049287622656';
  // newChat2.date = new Date();
  // newChat2.msg = 'pay attention to me';

  const newChat = new Chat();
  newChat.receiverId = '123Shroud';
  newChat.senderId = '101217049287622656';
  newChat.date = new Date();
  newChat.msg = 'hey shroud';

  const newChat1 = new Chat();
  newChat1.receiverId = '123Shroud';
  newChat1.senderId = '101217049287622656';
  newChat1.date = new Date();
  newChat1.msg = 'teach me how to be good';

  const newChat2 = new Chat();
  newChat2.receiverId = '123Shroud';
  newChat2.senderId = '101217049287622656';
  newChat2.date = new Date();
  newChat2.msg = 'like you';

  await chatRepo.save([newChat, newChat1, newChat2]);
}

createConnection().then(async () => {
  // seedData();
  // console.log("seeding pokimane")
  // await seedPoki();
  // console.log("seeding shroud")
  // await seedShroud();
  // console.log("seeding swipes")
  // await seedSwipes();

  seedSwipes()
});
