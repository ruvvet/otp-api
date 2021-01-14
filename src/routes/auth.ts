import { Request, Response, Router } from 'express';
import axios from 'axios';
import { config, oauth } from '../constants';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import { unauthorized } from '../utils';

const router = Router();

router.get('/', redirect);
router.post('/exchange', exchange);

function redirect(req: Request, res: Response) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${process.env.OAUTH_CALLBACK}&response_type=code&scope=identify`
  );
}

async function exchange(req: Request, res: Response) {
  const userAuth = await oauth
    .tokenRequest({
      code: req.body.code,
      scope: 'identify',
      grantType: 'authorization_code',
    })
    .catch((err) => {
      console.log(err);
      return null;
    });

  if (!userAuth) {
    return res.status(401).send();
  }

  // get back the user info () {username, locale, mfa_enabled, flags, avatar, discriminator, id}
  const userInfo = await oauth.getUser(userAuth.access_token);

  if (!userInfo) {
    return unauthorized(req, res);
  }

  //calculate expiration date
  const now = new Date().getTime();
  const expiryDate = new Date(now + 1000 * userAuth.expires_in);

  // lookup the user in the repo
  const userRepo = getRepository(User);
  const findUser = await userRepo.findOne({
    where: { discordId: userInfo.id },
  });

  // if no user, save a new user
  if (!findUser) {
    const newUser = new User();
    newUser.discordId = userInfo.id;
    newUser.discordUsername = userInfo.username;
    newUser.discordAvatar = userInfo.avatar || '';
    newUser.accessToken = userAuth.access_token;
    newUser.refreshToken = userAuth.refresh_token;
    newUser.expiry = expiryDate;
    await userRepo.save(newUser);
  } else {
    //TODO:
  }

  //save shit to the database
  // find user in db
  //if not in db...save new user

  //

  // else, update the user's info

  res.status(201).json(userAuth);
}

async function refresh(req: Request, res: Response) {}
