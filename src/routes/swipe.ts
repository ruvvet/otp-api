import { Request, Response, Router } from 'express';
import { getRepository, Not } from 'typeorm';
import { User } from '../entity/User';
import { Swipe } from '../entity/Swipe';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { JWT } from '../interfaces';
import { config } from '../constants';
import { unauthorized } from '../utils';

const router = Router();

router.get('/', getProfiles);
router.get('/matches', getMatches);
router.post('/', newSwipe);

// redirect to oauth link
async function getProfiles(req: Request, res: Response) {
  const userJwt = req.headers['x-otp-user'] as string;
  const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

  const userRepo = getRepository(User);
  const profiles = await userRepo.find({
    where: { discordId: Not(decodedJwt.user) },
    relations: ['pictures'],
  });

  res.json({ profiles: profiles });
}

async function newSwipe(req: Request, res: Response) {
  const userJwt = req.headers['x-otp-user'] as string;
  const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

  console.log(req.body.swipeId);

  // look up the user to see if they exist
  const userRepo = getRepository(User);
  const likerUser = await userRepo.findOne({
    where: { discordId: decodedJwt.user },
  });

  if (!likerUser) {
    return unauthorized(req, res);
  }

  //look up the liked user to see if they exist

  const likeeUser = await userRepo.findOne({
    where: { discordId: req.body.swipeId },
  });

  if (!likeeUser) {
    console.log('error, user does not exist');
  }

  const nowUTC = new Date().toUTCString();
  const now = new Date(nowUTC);

  // open the swipe repo and add the match
  const swipeRepo = getRepository(Swipe);
  const newSwipe = new Swipe();
  newSwipe.liker = likerUser as User;
  newSwipe.likee = likeeUser as User;
  newSwipe.time = now;
  await swipeRepo.save(newSwipe);

  ///TODO??????? as user??????
}

async function getMatches(req: Request, res: Response) {


  




}

module.exports = router;
