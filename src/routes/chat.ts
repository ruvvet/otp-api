import { Request, Response, Router } from 'express';
import { getRepository, In } from 'typeorm';
import { Chat } from '../entity/Chat';

const router = Router();

router.get('/:buddyId', getChatHistory);
router.get('/convos', getChatConvos);

async function getChatHistory(req: Request, res: Response) {
  const chatBuddy = '3'; //req.userId
  const chatBuddyOne = '1'; //req.params.buddyId

  const chatRepo = getRepository(Chat);

  const foundChat = await chatRepo.find({
    where: {
      sender: In([chatBuddyOne, chatBuddy]),
      receiver: In([chatBuddyOne, chatBuddy]),
    },
  });

  res.json(foundChat);
}

async function getChatConvos(req: Request, res: Response) {
  const tempMe = '1';

  const chatRepo = getRepository(Chat);
  // const convos = await chatRepo.find({
  //   select: ["sender", "receiver"],
  //   where: [{sender: tempMe }, {receiver: tempMe}]
  // })

  const convos = await chatRepo
    .createQueryBuilder('chat')
    .select('sender')
    .where('chat.receiver = :id', { id: tempMe })
    .distinctOn(['chat.sender'])
    .getMany();

  //TODO: COME BACK AND FIX THIS WHY IS THIS NOT WORKING

  console.log(convos);
  res.status(200).send();
}

module.exports = router;
