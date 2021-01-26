import { Request, Response, Router } from 'express';
import { getRepository, In } from 'typeorm';
import { Chat } from '../entity/Chat';

const router = Router();

router.get('/:buddyId', getChatHistory);
router.get('/', getChatConvos);

async function getChatHistory(req: Request, res: Response) {
  const chatRepo = getRepository(Chat);

  const foundChat = await chatRepo.find({
    where: {
      senderId: In([req.params.buddyId, req.userId]),
      receiverId: In([req.params.buddyId, req.userId]),
    },
  });

  res.json(foundChat);
}

async function getChatConvos(req: Request, res: Response) {
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
    .leftJoin('chat.sender', 'sender')
    .select([
      'chat.receiver',
      'chat.senderId',
      'receiver.discordId',
      'receiver.discordUsername',
      'receiver.displayName',
      'receiver.discordAvatar',
      'sender.discordId',
      'sender.discordUsername',
      'sender.displayName',
      'sender.discordAvatar',
    ])

    .where('chat.receiver = :id', { id: req.userId })
    .orWhere('chat.senderId = :id', { id: req.userId })
    .groupBy('chat.receiver')
    .addGroupBy('chat.senderId')
    .addGroupBy('receiver.discordId')
    .addGroupBy('sender.discordId')
    .getRawMany();

  const mergeConvos = convos.reduce((result, convo) => {
    const { chat_senderId, receiverId } = convo;

    const key =
      chat_senderId < receiverId
        ? `${chat_senderId}-${receiverId}`
        : `${receiverId}-${chat_senderId}`;

    if (chat_senderId === req.userId) {
      result[key] = {
        discordId: convo.receiver_discordId,
        discordUsername: convo.receiver_discordUsername,
        displayName: convo.receiver_displayName,
        discordAvatar: convo.receiver_discordAvatar,
      };
    } else {
      result[key] = {
        discordId: convo.sender_discordId,
        discordUsername: convo.sender_discordUsername,
        displayName: convo.sender_displayName,
        discordAvatar: convo.sender_discordAvatar,
      };
    }

    return result;
  }, {});

  res.json(Object.values(mergeConvos));
}

module.exports = router;
