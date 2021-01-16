import { Request, Response } from 'express';

export function unauthorized(req: Request, res: Response) {
  res.status(401).send();
}

// handle Axios Errors
export function handleAxiosError(err: Error) {
  console.log(err);
  return { data: null };
}

export function convertDaytoSec(days: number) {
  return days * 24 * 60 * 60;
}
