import { Request, Response } from 'express';

export function unauthorized(req: Request, res: Response) {
  res.status(401).send();
}
