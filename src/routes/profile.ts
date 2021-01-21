import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, Router } from 'express';
import multer from 'multer';
import { getRepository } from 'typeorm';
import { Picture } from '../entity/Picture';
import { User } from '../entity/User';
import { unauthorized } from '../utils';

const router = Router();

// MIDDLEWARE

const uploads = multer({ dest: './uploads/' });

router.get('/', getUser);
router.post('/', updateProfile);
router.put('/pics', uploads.single('pic'), uploadPics);

async function getUser(req: Request, res: Response) {
  // lookup the user in the repo
  const userRepo = getRepository(User);
  const foundUser = await userRepo.findOne({
    where: { discordId: req.userId },
    relations: ['pictures'],
  });

  res.json(foundUser);
}

async function updateProfile(req: Request, res: Response) {
  // lookup the user in the repo
  const userRepo = getRepository(User);
  const foundUser = await userRepo.findOne({
    where: { discordId: req.userId },
  });

  if (foundUser) {
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

async function uploadPics(req: Request, res: Response) {
  const file = req.file.path;

  // uploads to cloudinary
  cloudinary.uploader.upload(file, async (error, result) => {
    if (!result) {
      return res.status(500).send();
    }
    // 1. check if user exists
    const userRepo = getRepository(User);
    const foundUser = await userRepo.findOne({
      where: { discordId: req.userId },
    });

    if (!foundUser) {
      return unauthorized(req, res);
    }

    // else the user was, found, look up to see if a pic with same index exists
    const picRepo = getRepository(Picture);
    const foundPic = await picRepo.findOne({
      where: { user: foundUser, index: req.body.picKey },
    });

    if (foundPic) {
      // replace it
      foundPic.url = result.url;
      await picRepo.save(foundPic);
    } else {
      // add it
      const newPic = new Picture();
      newPic.user = foundUser;
      newPic.url = result.url;
      newPic.index = req.body.picKey;
      await picRepo.save(newPic);
    }
  });

  res.status(201).send();
}

module.exports = router;
