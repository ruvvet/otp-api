import { Request, Response, Router } from 'express';
import axios from 'axios';
import { config, oauth } from '../constants';

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

  //calculate expiration date
  const now = new Date().getTime();
  const expiryDate = now + 1000 * userAuth.expires_in;

  //save shit to the database
  // find user in db
  //if not in db...save new user

  // else, update the user's info

  res.status(201).json(userAuth)
}


async function refresh(req:Request, res:Response){

    
}