import { Request, Response, Router } from 'express';
import { getRepository, In } from 'typeorm';
import { Chat } from '../entity/Chat';

const router = Router();

router.get('/', getChatConvos);
router.get('/:buddyId', getChatHistory);

async function getChatHistory(req: Request, res: Response) {
  const chatRepo = getRepository(Chat);

  const foundChat = await chatRepo.find({
    where: {
      sender: In([req.params.buddyId, req.userId]),
      receiver: In([req.params.buddyId, req.userId]),
    },
  });

  res.json(foundChat);
}

async function getChatConvos(req: Request, res: Response) {
  console.log('convos');

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
    .leftJoin('chat.receiver', 'receiver')
    .select([
      'chat.receiver',
      'chat.senderId',
      'receiver.discordId',
      'receiver.discordUsername',
      'receiver.displayName',
      'receiver.discordAvatar',
    ])
    .where('chat.receiver = :id', { id: req.userId })
    .orWhere('chat.senderId = :id', { id: req.userId })
    .groupBy('chat.receiver')
    .addGroupBy('chat.senderId')
    .addGroupBy('receiver.discordId')
    .getRawMany();

  

  //TODO: join or lookup to get additional data
  res.json(convos);
}

module.exports = router;
