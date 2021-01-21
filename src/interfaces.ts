import {Request} from 'express'

export interface JWT {
  user: string;
  iat: number;
  exp: number;
}


export interface ValidatedRequest extends Request {
  userId: string,
}