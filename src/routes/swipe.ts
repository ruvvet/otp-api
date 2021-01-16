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

    console.log('hello')
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
const pretendProfiles = [
    {
      id: 1,
      name: 'rando 1',
      img: [
        'https://specials-images.forbesimg.com/imageserve/5f5f55887d9eec237a586841/960x0.jpg',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
    },
    {
      id: 2,
      name: 'sweaty 2',
      img: [
        'https://boundingintocomics.com/wp-content/uploads/2019/10/2019.10.25-05.14-boundingintocomics-5db32d840ef42.png',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
    },
    {
      id: 3,
      name: 'feeder 3',
      img: [
        'https://a.espncdn.com/photo/2018/0917/r432464_1600x800cc.jpg',
        'https://www.tubefilter.com/wp-content/uploads/2020/11/pokimane-twitch-donations-cap-streamlabs.jpg',
        'https://cdn1.dotesports.com/wp-content/uploads/2020/09/14075123/pokimane-vtuber-1024x575.jpg',
      ],
    },
  ];

  res.send({profiles: pretendProfiles})


}

function getMatches(req: Request, res: Response) {
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

function newSwipe(req: Request, res: Response) {
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

module.exports = router;
