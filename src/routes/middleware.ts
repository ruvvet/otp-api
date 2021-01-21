import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import qs from 'qs';
import { getRepository } from 'typeorm';
import { config } from '../constants';
import { User } from '../entity/User';
import { JWT } from '../interfaces';
import { convertDaytoSec, handleAxiosError, unauthorized } from '../utils';

export async function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //check headers for their jwt token
  const userJwt = req.headers['x-otp-user'] as string;

  // find them in the user table based on the discordid

  if (userJwt) {
    //decode the jwt
    const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

    // lookup the user in the repo
    const userRepo = getRepository(User);
    const foundUser = await userRepo.findOne({
      where: { discordId: decodedJwt.user },
    });
    if (foundUser) {
      console.log('i found the user', foundUser.discordUsername);
      //compare current time and expiration
      const now = new Date().getTime();
      const expiryDate = foundUser.expiry.getTime();

      // if expiry date is less than 1 day
      const day = 1000 * convertDaytoSec(1);

      // refresh their token
      if (expiryDate - now < day) {
        // call the refresh function, pass in found user obj
        const updatedUser = await refresh(foundUser);
        // save the modified returned user obj
        await userRepo.save(updatedUser);
      }
    }

    req.userId = decodedJwt.user;

    next();
  } else {
    unauthorized(req, res);
  }
}

async function refresh(user: User) {
  // make an api post call to discord with the client credentials
  // this returns a new access token + refresh token
  const data = {
    client_id: config.CLIENT_ID,
    client_secret: config.CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: user.refreshToken,
  };

  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

  const { data: newToken } = await axios({
    method: 'post',
    url: 'https://discord.com/api/oauth2/token',
    data: qs.stringify(data),
    headers,
  }).catch(handleAxiosError);

  // calculate the expiration
  const now = new Date().getTime();
  const expiryDateUTC = new Date(
    now + 1000 * newToken.expires_in
  ).toUTCString();
  const expiryDate = new Date(expiryDateUTC);

  // update the user object

  user.accessToken = newToken.access_token;
  user.refreshToken = newToken.refresh_token;
  user.expiry = expiryDate;

  // return the user object
  return user;
}



//TODO:
// save - #last activity date on middleware as new field anytime any route is accessed
// use that to compare new/old chat + match notifications
// save those to redux to set as badges
//