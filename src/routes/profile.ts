import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/', getUser);
router.post('/', updateUserSettings);

// redirect to oauth link
function getUser(req: Request, res: Response) {
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

function updateUserSettings(req: Request, res: Response) {
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

module.exports = router;
