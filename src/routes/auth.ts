import bodyParser from 'body-parser';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { config, oauth } from '../constants';
import { User } from '../entity/User';
import { JWT } from '../interfaces';
import { convertDaytoSec, unauthorized } from '../utils';

const router = Router();

// MIDDLEWARE
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', redirect);
router.post('/exchange', exchange);
router.get('/token', refreshJWT);

// redirect to oauth link
function redirect(req: Request, res: Response) {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${config.CLIENT_ID}&redirect_uri=${process.env.OAUTH_CALLBACK}&response_type=code&scope=identify`
  );
}

// exchange code for tokens
async function exchange(req: Request, res: Response) {
  console.log(req.body.code);

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

  // if nothing is returned, error
  if (!userInfo) {
    return unauthorized(req, res);
  }

  //calculate expiration date
  //TODO: update to utc?
  const now = new Date().getTime();
  const expiryDateUTC = new Date(
    now + 1000 * userAuth.expires_in
  ).toUTCString();
  const expiryDate = new Date(expiryDateUTC);

  console.log(expiryDate, expiryDate.getTime(), expiryDateUTC);

  // lookup the user in the repo
  const userRepo = getRepository(User);
  const findUser = await userRepo.findOne({
    where: { discordId: userInfo.id },
  });

  // if found, they're already in the database
  if (findUser) {
    console.log('found me');
    // update them, send them a new jwt token
    findUser.accessToken = userAuth.access_token;
    findUser.refreshToken = userAuth.refresh_token;
    findUser.expiry = expiryDate;
    await userRepo.save(findUser);

    const token = jwt.sign(
      { exp: new Date().getTime() / 1000 + convertDaytoSec(30) , user: findUser.discordId},
      config.JWT_SECRET
    );

    // return status code 200, for updated + jwt
    return res.status(200).json(token);
  }

  // else create a new user
  console.log('make new person');
  const newUser = new User();
  newUser.discordId = userInfo.id;
  newUser.discordUsername = userInfo.username;
  newUser.discordAvatar = userInfo.avatar || '';
  newUser.accessToken = userAuth.access_token;
  newUser.refreshToken = userAuth.refresh_token;
  newUser.expiry = expiryDate;
  await userRepo.save(newUser);

  const token = jwt.sign(
    { exp: new Date().getTime() / 1000 + convertDaytoSec(30) , user: newUser.discordId},
    config.JWT_SECRET
  );
;

  console.log('jwt token', token);
  // return status code 201 for created + jwt
  return res.status(201).json(token);
}

function refreshJWT(req: Request, res: Response) {
  const userJwt = req.headers['X-OTP-User'] as string;

  if (!userJwt) {
    return unauthorized(req, res);
  }

  try {
    const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

    if (decodedJwt.exp * 1000 - new Date().getTime() < 24 * 60 * 60 * 1000) {
      const token = jwt.sign(
        {
          exp: new Date().getTime() / 1000 + 30 * 24 * 60 * 60,
          user: decodedJwt.user,
        },
        config.JWT_SECRET
      );

      return res.json(token);
    }
    return res.status(200).send();
  } catch (error) {
    // if (error instanceof TokenExpiredError) {
    //   // token expired, but we signed it

    //   res.

    // }
    return res.status(401).send();

    // else this is not our token
  }
}

module.exports = router;
