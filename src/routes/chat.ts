import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', test);

function test(req: Request, res: Response) {
  res.send('hi');
}

module.exports = router;
