import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { unauthorized, handleAxiosError } from '../utils';
import { config } from '../constants';
import { JWT } from '../interfaces';
import { Picture } from '../entity/Picture';

const router = Router();

// MIDDLEWARE
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', getUser);
router.post('/', updateProfile);
router.put('/pics', uploadPics);


async function getUser(req: Request, res: Response) {
  const userJwt = req.headers['x-otp-user'] as string;
  const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

    console.log('getting details')
  // lookup the user in the repo
  const userRepo = getRepository(User);
  const foundUser = await userRepo.findOne({
    where: { discordId: decodedJwt.user },
  });

  res.json(foundUser);
}

async function updateProfile(req: Request, res: Response) {
  const userJwt = req.headers['x-otp-user'] as string;
  const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

  // lookup the user in the repo
  const userRepo = getRepository(User);
  const foundUser = await userRepo.findOne({
    where: { discordId: decodedJwt.user },
  });

  console.log(foundUser);

  if (foundUser) {
    console.log(foundUser);
    foundUser.displayName = req.body.displayName;
    foundUser.rank = req.body.rank;
    foundUser.twitch = req.body.socials.twitch;
    foundUser.twitter = req.body.socials.twitter;
    foundUser.instagram = req.body.socials.instagram;
    foundUser.snapchat = req.body.socials.snapchat;
    foundUser.tiktok = req.body.socials.tiktok;
    foundUser.spotify = req.body.socials.spotify;
    foundUser.facebook = req.body.socials.facebook;
    foundUser.reddit = req.body.socials.reddit;
    foundUser.att = req.body.mainAtt;
    foundUser.def = req.body.mainDef;
    await userRepo.save(foundUser);

    res.status(201).send();
  }

  return unauthorized(req, res);
}



async function uploadPics(req: Request, res: Response){
    const userJwt = req.headers['x-otp-user'] as string;
    const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;


    const pictureRepo = getRepository(Picture);
    





}


module.exports = router;
