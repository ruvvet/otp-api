import { config } from '../constants';
import { unauthorized, handleAxiosError, convertDaytoSec } from '../utils';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response, Router } from 'express';
import axios from 'axios';
import qs from 'qs';
import {JWT} from '../interfaces'

export async function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //check headers for their jwt token
  const userJwt = req.headers['X-OTP-User'] as string;

  // find them in the user table based on the discordid

  if (userJwt) {
    //decode the jwt
    const decodedJwt = jwt.verify(userJwt, config.JWT_SECRET) as JWT;

    // lookup the user in the repo
    const userRepo = getRepository(User);
    const findUser = await userRepo.findOne({
      where: { discordId: decodedJwt.user.discordId },
    });
    if (findUser) {
      //compare current time and expiration
      const now = new Date().getTime();
      const expiryDate = findUser.expiry.getTime();

      // if expiry date is less than 1 day
      const day = 1000 * convertDaytoSec(1);

      // refresh their token
      if (expiryDate - now < day) {
        // call the refresh function, pass in found user obj
        const updatedUser = await refresh(findUser);
        // save the modified returned user obj
        await userRepo.save(updatedUser);
      }
    }
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
