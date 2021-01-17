import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const router = Router();

// MIDDLEWARE
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', getUser);
router.post('/', updateSettings);

// redirect to oauth link
function getUser(req: Request, res: Response) {
//   const userJWT = jwt.verify(user, config.JWT_SECRET);
}

function updateSettings(req: Request, res: Response) {
    console.log(req.body)
}

module.exports = router;
