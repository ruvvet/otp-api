import { Request, Response, Router } from 'express';
import { getRepository, Not } from 'typeorm';
import { Swipe } from '../entity/Swipe';
import { User } from '../entity/User';
import { unauthorized } from '../utils';

const router = Router();

router.get('/', getProfiles);
router.get('/matches', getMatches);
router.post('/', newSwipe);

// redirect to oauth link
async function getProfiles(req: Request, res: Response) {
  const userRepo = getRepository(User);
  const profiles = await userRepo.find({
    where: { discordId: Not(req.userId) },
    relations: ['pictures'],
  });

  //TODO:  ONLY SEND BACK PROFILES OF PEOPLE YOU HAVE NOT MATCHED WITH
  // only send back the non-sensitive information

  res.json({ profiles: profiles });
}

async function newSwipe(req: Request, res: Response) {

  // look up the user to see if they exist
  const userRepo = getRepository(User);
  const likerUser = await userRepo.findOne({
    where: { discordId: req.userId },
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
  const swipeRepo = getRepository(Swipe);
  const matches = await swipeRepo
    .createQueryBuilder('swipe')
    .where('swipe.likee = :user', { user: req.userId })
    .andWhere((qb) => {
      const subQuery = qb
        .subQuery()
        .select()
        .from(Swipe, 'swipeInner')
        .where('swipeInner.likee = swipe.liker')
        .andWhere('swipeInner.liker = swipe.likee')
        .getQuery();
      return `EXISTS ${subQuery}`;
    })
    .leftJoinAndSelect('swipe.liker', 'liker')
    .getMany();


  res.json(matches);
  //TODO: get back pictures as a relationship as well
  //TODO: this is broke now?
}

module.exports = router;
