import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', getProfiles);
router.get('/matches', getMatches);
router.post('/', newSwipe);

// redirect to oauth link
function getProfiles(req: Request, res: Response) {
  const pretendProfiles = [
    {
      discordId: '1',
      discordUsername: 'rando1',
      discordAvatar:
        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
      accessToken: '1',
      refreshToken: '1',
      expiry: '1',
      displayName: 'POKIMANE',
      rank: 'Silver I',
      pictures: [
        'https://specials-images.forbesimg.com/imageserve/5f5f55887d9eec237a586841/960x0.jpg',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
      twitch: 'pokimane',
      twitter: 'pokimane',
      instagram: 'pokimane',
      snapchat: 'pokimane',
      tiktok: null,
      spotify: null,
      facebook: null,
      reddit: 'pokimane',
      att: 'Dokkaebi',
      def: 'Doc',
    },
    {
      discordId: '2',
      discordUsername: 'rando2',
      discordAvatar:
        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
      accessToken: '2',
      refreshToken: '2',
      expiry: '2',
      displayName: 'SHROUD',
      rank: 'Champion',
      pictures: [
        'https://boundingintocomics.com/wp-content/uploads/2019/10/2019.10.25-05.14-boundingintocomics-5db32d840ef42.png',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
      twitch: 'shroud',
      twitter: 'shroud',
      instagram: 'shroud',
      snapchat: 'shroud',
      tiktok: 'shroud',
      spotify: 'shroud',
      facebook: 'shroud',
      reddit: 'shroud',
      att: 'Fuze',
      def: 'Mozzie',
    },
    {
      discordId: '3',
      discordUsername: 'rando3',
      discordAvatar:
        'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
      accessToken: '3',
      refreshToken: '3',
      expiry: '3',
      displayName: 'ninja',
      rank: 'Gold III',
      pictures: [
        'https://a.espncdn.com/photo/2018/0917/r432464_1600x800cc.jpg',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
      twitch: 'ninja',
      twitter: 'ninja',
      instagram: 'ninja',
      snapchat: 'ninja',
      tiktok: null,
      spotify: null,
      facebook: null,
      reddit: 'hello',
      att: 'Amaru',
      def: 'Wamai',
    },
  ];

  res.json({ profiles: pretendProfiles });
}

function getMatches(req: Request, res: Response) {
  //   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

function newSwipe(req: Request, res: Response) {
  //   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

module.exports = router;
