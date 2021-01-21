import { Request, Response, Router } from 'express';
import { getRepository, In } from 'typeorm';
import { Chat } from '../entity/Chat';

const router = Router();

router.get('/convos', getChatConvos);
router.get('/:buddyId', getChatHistory);

async function getChatHistory(req: Request, res: Response) {

  const chatBuddy = '1'; //req.userId
  const chatBuddyOne = '2'; //req.params.buddyId

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

  console.log('convos')
  const tempMe = '1';

  const chatRepo = getRepository(Chat);
  // const convos = await chatRepo.find({
  //   select: ["sender", "receiver"],
  //   where: [{sender: tempMe }, {receiver: tempMe}]
  // })


  // const convos = await chatRepo
  //   .createQueryBuilder('chat')
  //   .where('chat.receiver = :id', { id: tempMe })
  //   .orWhere('chat.sender = :id', { id: tempMe })
  //   .groupBy('chat.id')
  //   .addGroupBy("chat.receiver")
  //   .orderBy('chat.date', 'DESC')
  //   .getMany();



  const convos = await chatRepo
    .createQueryBuilder('chat')
    .select(['chat.receiver','chat.sender'])
    .where('chat.receiver = :id', { id: tempMe })
    .orWhere('chat.sender = :id', { id: tempMe })
    .groupBy('chat.receiver')
    .addGroupBy('chat.sender')
    .getRawMany();



  //TODO: join or lookup to get additional data
  res.json(convos);
}

module.exports = router;
